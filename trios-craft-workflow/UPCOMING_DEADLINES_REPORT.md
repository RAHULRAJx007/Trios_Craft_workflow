# UPCOMING_DEADLINES_REPORT.md

## Goal
Add an **Upcoming Deadlines** widget to the Dashboard that lists the nearest task deadlines for the next 7 days.

## Requirements (from Calendar Finalization Sprint)
### Phase 1 — Implement widget
- Location: Dashboard
- Show next **7 days** deadlines
- Display per item:
  - Task title
  - Project
  - Due date
  - Priority
  - Assignee
- Sort: **Nearest deadline first**
- Limit: **Top 10** tasks

### Phase 2 — Dashboard integration
- Add widget to Dashboard homepage
- Use existing design system (cards/section-label/buttons)

### Phase 3 — Realtime updates
Widget updates automatically when:
- task created
- due_date changes
- task deleted

### Phase 4 — Overdue indicator
Show 🔴 Overdue for tasks where:
- `due_date < today`
- `status != completed`

### Phase 5 — Manual QA checklist
Verify:
- Create task with due_date → appears in widget
- Move task date → widget updates
- Complete task → disappears from upcoming/overdue
- Realtime works across two sessions/users

## Status
- ✅ Calendar core (views, filters, search, realtime, drag/drop) already present.
- ⚠ Upcoming Deadlines widget: **Not implemented yet** (audit could not find existing widget).

## Next implementation steps (to reach 100%)
1. Inspect dashboard home page/component and identify where widgets are rendered.
2. Implement widget component:
   - fetch tasks with non-null `due_date`
   - filter due_date within next 7 days (plus separate overdue query)
   - enrich tasks with project + assignee names
3. Add realtime channel(s) for `tasks` INSERT/UPDATE/DELETE affecting due_date.
4. Add overdue section/indicator.
5. Wire into Dashboard layout.
6. Run manual QA.

