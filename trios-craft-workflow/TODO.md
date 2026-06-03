# TODO

## Kanban Board system
- [x] Install dnd-kit packages
- [ ] Add Kanban UI components using dnd-kit (KanbanBoard, KanbanColumn, TaskCard, DragOverlay)
- [ ] Add helper library for kanban mappings, filters, and progress computation
- [ ] Add API route(s):
  - [ ] `GET /api/kanban` for listing tasks with filters + projects
  - [ ] `POST /api/kanban/move` to update task status + recompute project progress + log activities
- [ ] Add routes:
  - [ ] `/kanban`
  - [ ] `/projects/[id]/kanban`
- [ ] Add realtime subscriptions for tasks/projects updates on kanban pages
- [ ] Update ActivityFeed icon/labels to support:
  - [ ] `task moved to review`
  - [ ] `completed task ...`
- [ ] Ensure mobile responsiveness
- [ ] Sanity check dnd-kit integration and drag overlay

## Project Wiki & Knowledge Base Sprint
- [ ] PHASE 1–2: Add SQL migrations for `project_wiki_pages` and `project_wiki_versions`
- [ ] PHASE 1–2: Add RLS policies for wiki tables (admin/member/client)
- [ ] PHASE 3: Add route `/projects/[id]/wiki`
- [ ] PHASE 4: Implement components `WikiPageList`, `WikiEditor`, `WikiVersionHistory`
- [ ] PHASE 5: Auto-create default pages when a project is created
- [ ] PHASE 6: Version history with restore
- [ ] PHASE 7: Search (title + content)
- [ ] PHASE 8: Activity feed logging for wiki create/update/restore
- [ ] PHASE 9: Notifications on wiki update
- [ ] PHASE 10: Permissions enforcement + client read-only for selected pages
- [ ] PHASE 11: Build + basic verification (create/edit/delete/restore/search)

