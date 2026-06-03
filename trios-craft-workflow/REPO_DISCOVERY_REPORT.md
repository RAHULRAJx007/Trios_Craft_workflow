# REPO_DISCOVERY_REPORT.md

This report captures the repository architecture and implementation constraints for adding a Notion-style Project Wiki to TriosFlow.

## 1) Current codebase
- **Framework**: Next.js App Router.
- **Frontend**: React components under `src/components/**`, with UI built using inline styles and shared classes (e.g., `btn`, `card`, `input`, `badge`).
- **Auth/roles**:
  - `src/lib/getCurrentUserRole.ts` determines user role as `admin | member | client`.
  - `src/components/RoleGuard.tsx` does client-side gating/redirects.
  - `src/lib/client-auth.ts` loads the current client user from `client_users`.

## 2) Supabase integration
- Supabase client: `src/lib/supabase.ts`.

## 3) Activity feed + logging
- Activity log table is `activities`.
- `src/lib/activity.ts` inserts activity rows.
- `src/components/ActivityFeed.tsx` subscribes to realtime INSERTs on `activities` and displays latest 20.

## 4) Notifications patterns
- Notifications table: `notifications`.
- `src/lib/notifications.ts` provides notification helpers:
  - `createNotification`
  - `createNotificationForAdmins`
  - `createNotificationForClient`
  - read/mark read helpers
- UI bell: `src/components/NotificationBell.tsx` subscribes to realtime INSERTs for the current user.

## 5) Existing project data patterns
- Admin “Projects” page (create/list) is `src/app/projects/page.tsx`.
- Admin project details page is `src/app/projects/[id]/page.tsx` (RoleGuard `admin`).
- Member project experience uses `src/app/projects/[id]/kanban/page.tsx` (RoleGuard `admin|member`).
- Client project details uses `src/app/client/projects/[id]/page.tsx` and filters by `projects.client_id` (client membership).

## 6) Project files / attachments patterns
- Document center implemented using:
  - DB table: `files` (metadata)
  - Storage bucket: `project-files`
- Storage folder convention:
  - `project_<projectId>/<categoryFolder>/<generated_uuid>_<original_file_name>`
- RLS policies exist on `files` and `storage.objects`.

## 7) Database schema conventions from migrations
- Migrations live in `migrations/` and currently include:
  - `activities`
  - `expenses`
  - `clients` and `projects.client_id`
  - `invoices/quotations`
  - `notifications`
  - `files` + storage bucket + policies
  - `team chat`

Existing RLS style:
- Admin: `FOR ALL`.
- Member: `FOR SELECT` (and sometimes INSERT).
- Client: read-only via joins to `client_users` and constraints based on `projects.client_id` and/or storage folder names.

## 8) Implementation implications for the Wiki sprint
The wiki feature should:
- Use Supabase tables with **RLS-first** access control aligned to existing role system.
- Use `src/lib/activity.ts` for activity feed entries.
- Use `src/lib/notifications.ts` when wiki pages are updated (notify project members).
- Place the wiki UI under:
  - `/projects/[id]/wiki` ⇒ `src/app/projects/[id]/wiki/page.tsx`
- Add wiki editor UI as client components.

## 9) Recommended data model additions (aligned to sprint phases)
- New tables:
  - `project_wiki_pages`
  - `project_wiki_versions`
  - (Optional but recommended for attachments) `project_wiki_attachments`

Rationale:
- The existing `files` table is already tied to storage and uses RLS policies by `category`. Adding wiki-specific metadata is easier/safer with a dedicated table.

## 10) Summary
- All wiki behavior should follow existing patterns:
  - Role evaluation: `getCurrentUserRole()` + `RoleGuard`.
  - Activity feed: insert to `activities`.
  - Notifications: insert into `notifications`.
  - Attachments: use `project-files` bucket + RLS-like policies enforced by new tables/policies.
- Wiki route must be placed in `src/app/projects/[id]/wiki`.

