# PROJECT_WIKI_REPORT.md

Goal: Notion-style project knowledge base inside TriosFlow.

This report summarizes what will be implemented/changed to satisfy the sprint Phases 1–11.

---

## Assumptions / constraints from repo
- Next.js App Router.
- Supabase provides auth + Postgres + Storage.
- Role system already exists:
  - `admin | member` are stored in `profiles.role`.
  - `client` is stored in `client_users.role` and relates to projects via `projects.client_id`.
- Activity feed uses `activities` table + realtime subscription.
- Notifications use `notifications` table + realtime subscription.
- Existing “project files” attachment model uses:
  - `files` table metadata
  - `project-files` storage bucket
  - RLS policies in migrations for select/insert.

---

## Database (Phase 1–2)
### Phase 1: `project_wiki_pages`
Create a new table with columns:
- `id uuid pk`
- `project_id uuid fk projects(id)`
- `title text not null`
- `content text`
- `created_by uuid`
- `created_at timestamptz`
- `updated_at timestamptz`

### Phase 2: `project_wiki_versions`
Create a new table:
- `id uuid pk`
- `page_id uuid fk project_wiki_pages(id)`
- `old_content text`
- `updated_by uuid`
- `updated_at timestamptz`

### Attachments note (Phases 7)
To keep attachments isolated and avoid breaking existing `files` RLS/category semantics, implement attachments as a wiki-specific table (recommended):
- `project_wiki_attachments` (or equivalent)

These attachments will store metadata and link uploaded Supabase storage objects under the same existing `project-files` bucket using folder naming like:
- `project_<projectId>/wiki/<pageId>/<generated_uuid>_<original_file_name>`

(Implementation details captured in the code changes.)

---

## Default pages (Phase 5)
When a project is created (in `src/app/projects/page.tsx` admin createProject flow), auto-insert pages:
- Requirements
- Meeting Notes
- Deployment Notes
- API Documentation

---

## Routes (Phase 3)
Create route:
- `/projects/[id]/wiki`

Implementation folder:
- `src/app/projects/[id]/wiki/page.tsx`

---

## Wiki UI (Phase 4)
Create components (structure):
- `WikiPageList`
- `WikiEditor`
- `WikiVersionHistory`

Features:
- Create page
- Edit page
- Delete page
- Rich text editor (implemented using a lightweight approach compatible with current stack)
- Headings/lists/code/table/links
- Auto-save

---

## Search (Phase 7)
Implement server-side or API-assisted search over:
- title
- content

Route can be:
- the wiki page itself with query params, or
- a dedicated API route under `src/app/api/...`

---

## Version history (Phase 6)
- On each save, insert old content into `project_wiki_versions`.
- Provide a “restore” action in version history.

Restoring a version will:
1) set `project_wiki_pages.content` = old_content
2) log another version row (so restores are also versioned)

---

## Activity feed (Phase 8)
When wiki actions occur:
- Wiki page created
- Wiki page updated
- Wiki page restored

Use:
- `src/lib/activity.ts` (`logActivity`) with action strings matching UI icon mapping patterns.

---

## Notifications (Phase 9)
When wiki is updated:
- Notify project members.

Implementation approach:
- For admin/member: notify users in `profiles` based on membership rules.
- For clients: optionally notify selected pages based on RLS permissions.

The notification API helper used:
- `src/lib/notifications.ts`

---

## Permissions (Phase 10)
Reuse role system:
- Admin: full access (RLS policies + UI guard)
- Member: create/edit + read
- Client: read-only for selected pages

Implementation approach:
- Add RLS policies on wiki tables:
  - Admin: `FOR ALL`.
  - Member: `FOR SELECT` (and `FOR INSERT/UPDATE/DELETE` as needed).
  - Client: `FOR SELECT` only on pages they’re allowed to see.

To support “selected pages” for clients, implement either:
- a join table like `project_wiki_page_permissions` (recommended), or
- a simple assumption: client sees all wiki pages for their project.

(Implementation details captured in the final code.)

---

## Testing plan (Phase 11)
Verify:
- Create wiki page
- Edit wiki page (auto-save)
- Search results for title/content
- Restore version
- Permission enforcement (admin/member/client)
- Activity feed entries
- Notifications on updates

---

## Deliverables
- Code changes to:
  - SQL migrations
  - Supabase RLS policies
  - New wiki route + components
  - Wiring into project creation + activity feed + notifications
- Output reports:
  - `REPO_DISCOVERY_REPORT.md`
  - `PROJECT_WIKI_REPORT.md`

