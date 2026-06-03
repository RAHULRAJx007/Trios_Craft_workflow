# CALENDAR_AUDIT.md

## Inventory (existing implementation)

### Month View
✅ **Complete**
- Implemented in: `src/components/calendar/CalendarView.tsx` (`MonthGrid`)
- Shows month grid with task chips grouped by `due_date`.

### Week View
✅ **Complete**
- Implemented in: `src/components/calendar/CalendarView.tsx` (`WeekGrid`)
- Renders 7-day grid with hourly rows; supports task drag/drop.

### Day View
✅ **Complete**
- Implemented in: `src/components/calendar/CalendarView.tsx` (`DayView`)
- Renders tasks for a single `anchorDate` with drag/drop.

### Realtime status
✅ **Complete** (basic)
- Implemented in: `src/components/calendar/CalendarPageClient.tsx`
- Subscribes to Supabase realtime events on `public.tasks` for `INSERT`, `UPDATE`, and `DELETE`.

### Drag & Drop status
✅ **Complete**
- Implemented in: `src/components/calendar/CalendarView.tsx` and used by `CalendarPageClient`.
- Month/Week/Day cells are drop targets.
- Drop calls `onTaskDueDateChange(taskId, newISODate)`.

### Filters status
✅ **Complete**
- Implemented in: `src/components/calendar/CalendarPageClient.tsx` + toolbar in `CalendarView.tsx`.
- Project filter: `projectFilter`
- Assignee filter: `assigneeFilter`
- Priority filter: `priorityFilter`

### Search status
✅ **Complete**
- Implemented in: `src/components/calendar/CalendarPageClient.tsx` + toolbar in `CalendarView.tsx`.
- Search matches task `title`, `project_name`, and `assigned_name`.

### Upcoming Deadlines widget status
❌ **Missing / Not found (from inspected files)**
- `src/components/AnalyticsDashboard.tsx` and dashboard-related inspected components do not contain an “upcoming deadlines” widget.
- No deadline widget was found via targeted reads.

---

## Notes on due_date loading & updating
- Tasks are loaded from Supabase in `CalendarPageClient.tsx`:
  - `.not("due_date", "is", null)`
  - ordered by `due_date` ascending
- Drag/drop updates `tasks.due_date` directly:
  - `supabase.from("tasks").update({ due_date: newISODate }).eq("id", taskId)`
- Realtime UPDATE handler updates local state based on `payload.new.due_date`.

## Files included in audit
- `src/app/calendar/page.tsx`
- `src/components/calendar/CalendarPageClient.tsx`
- `src/components/calendar/CalendarView.tsx`
- `src/lib/kanban.ts` (only contains generic kanban helpers; not calendar due-date logic)
- `src/app/api/kanban/route.ts` (does not manage `due_date`)

