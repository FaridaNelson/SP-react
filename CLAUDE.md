# StudioPulse Frontend — Claude Code Context

## Stack

React — see package.json for full deps

## Backend

Local: http://localhost:4000
Prod: https://api.studiopulse.co (or your Cloud Run URL)
All fetch calls must include: credentials: 'include'
See SP-express/CLAUDE.md for full endpoint + enum reference

## Design system

Fonts: Cormorant Garamond (headings/serif) + DM Sans (body)
CSS variables:
--cream: #FAF7F2 --gold: #C9A84C
--ink: #1C1A17 --rose: #D4806A
--sage: #7A9E87 --border: rgba(28,26,23,0.1)

## Migration status — mock → live API

## Phase C (future sprint)

- [ ] Add second instrument to existing student
  - UI: "Add instrument" button on student profile
  - Creates a new TeacherStudentAccess record for the new instrument
  - Opens ExamCycleWizard pre-set to the new instrument
  - Student profile shows instrument tabs (Piano | Guitar)
  - Each tab shows its own cycle history and progress

### Done

- [ ] Auth (login/logout/me)

### In progress

- [ ] ExamCycle creation wizard (HTML prototype: teacher-dashboard_exam_completion.html)

### Not started

- [ ] ExamCycle completion flow
- [ ] ExamCycle withdrawal flow
- [ ] Lesson upsert
- [ ] Score entry
- [ ] Parent dashboard

## Critical enum mapping (wizard → backend)

"ABRSM - Performance" → "Performance"
"ABRSM - Practical" → "Practical"
Grade level (string) → examGrade (integer)

## Known patterns

- Error boundary: all API calls wrapped in try/catch, show toast on failure
- Auth: useAuth() hook manages session state from GET /api/auth/me
