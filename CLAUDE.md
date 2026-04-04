# StudioPulse Frontend — Claude Code Context

## Product vision (summary)

StudioPulse turns informal, paper-based music exam prep into a structured,
data-driven platform. The core concept is the **Triangle of Success**: teacher,
student, and parent all share a single live readiness snapshot after every lesson
— expressed in the language most useful to each audience. No information asymmetry,
no chasing, no surprises on exam day.

**Readiness target:** 67% = ABRSM pass mark. All progress indicators are relative
to this threshold.

## Platform roadmap

| Phase | Status        | Scope                                                                     |
| ----- | ------------- | ------------------------------------------------------------------------- |
| 1     | Live now      | Three dashboards — teacher, parent, student                               |
| 2     | Next release  | School manager layer (above teacher)                                      |
| 3     | Future        | StudioPulse Marketplace — teacher discovery by verified exam pass rate    |
| 4     | Future vision | AI + MIDI evaluation (digital keyboard input → objective readiness score) |

### Phase 1 — Three dashboards (current build focus)

**Teacher dashboard**

- Exam cycles (grade, type, target date, pass mark per student)
- Per-lesson grading against structured ABRSM criteria
- Live readiness % vs 67% pass mark
- Lesson time suggestion (allocates minutes to pieces/scales/sight-reading/aural
  based on current weaknesses and weeks to exam)
- Homework assignment — set, track, review
- Schedule view — today's lessons and upcoming sessions

**Parent dashboard**

- Lesson summaries (what was covered, how student performed)
- Progress reports — readiness score and skill breakdown over time
- Homework visibility — tasks and completion status
- Exam countdown — days to exam, lessons remaining, readiness trend
- Teacher notes — guidance on supporting practice at home

**Student dashboard**

- My progress — personal readiness score and skill heatmap
- This week's homework — tasks, practice goals, time targets
- Exam countdown — days remaining and lessons left
- Piece tracker — status of each exam piece and exercise
- Lesson notes — teacher feedback from each session

### Phase 2 — School manager layer (design ahead for this)

A school account sits above teachers. Principals/studio directors can evaluate
teacher effectiveness across the school.

- Teacher effectiveness — pass rates by teacher
- Strengths & weaknesses — per teacher, per skill area (e.g. aural vs technique)
- CPD & training needs — data-led recommendations for teacher development
- Cohort analytics — school-wide exam readiness at a glance

New role: `school_manager` (not yet in enums — coming Phase 2 sprint)

### Phase 3 — Marketplace (sister service, separate frontend)

Public-facing web service for teacher discovery.

- Search by location, instrument, grade level, availability
- Verified success-rate ranking (backed by real ABRSM outcome data)
- Verified reviews — only parents of active students can review
- Remote & local lesson options

### Phase 4 — AI + MIDI evaluation (long-term)

- MIDI capture: note accuracy, timing, dynamics from digital keyboard
- AI performance model: trained on ABRSM criteria + student outcome data
- Independent readiness score alongside teacher assessment
- Teacher assist: flags weak areas, generates targeted practice recommendations

No competitor can replicate this without the underlying lesson-by-lesson dataset
that StudioPulse accumulates from Phase 1 onward — this is the defensibility moat.

---

## Stack

React — see package.json for full deps

## Backend

Local: http://localhost:4000
Prod: https://api.studiopulse.co (or Cloud Run URL)
All fetch calls must include: `credentials: 'include'`
See SP-express/CLAUDE.md for full endpoint + enum reference

## Design system

Fonts: Cormorant Garamond (headings/serif) + DM Sans (body)

CSS variables:

```
--cream: #FAF7F2     --gold: #C9A84C
--ink:   #1C1A17     --rose: #D4806A
--sage:  #7A9E87     --border: rgba(28,26,23,0.1)
```

Phase colour coding (for future school manager / roadmap UI):

```
Phase 1 — purple:  #7F77DD  (current)
Phase 2 — teal:    #1D9E75  (school manager)
Phase 3 — amber:   #BA7517  (marketplace)
Phase 4 — coral:   #D85A30  (AI + MIDI)
```

---

## Migration status — mock → live API

### Phase C (future sprint)

- [ ] Add second instrument to existing student
  - UI: "Add instrument" button on student profile
  - Creates a new TeacherStudentAccess record for the new instrument
  - Opens ExamCycleWizard pre-set to the new instrument
  - Student profile shows instrument tabs (Piano | Guitar)
  - Each tab shows its own cycle history and progress

### Done

- [x] Auth (login/logout/me)
- [x] ExamCycle creation wizard
- [x] Forgot password / reset password flow
- [x] Legal pages (PrivacyPolicy, TermsOfService)

### In progress

- [ ] ExamCycle creation wizard — needs modifications (describe what)
- [ ] ExamCycle completion wizard — built, needs modifications (describe what)
- [ ] ExamCycle withdrawal flow
- [ ] Lesson upsert
- [ ] Score entry

### Not started

- [ ] Parent dashboard
- [ ] Student dashboard
- [ ] School manager dashboard (Phase 2)

---

## Critical enum mapping (wizard → backend)

```
"ABRSM - Performance" → "Performance"
"ABRSM - Practical"   → "Practical"
Grade level (string)  → examGrade (integer)
```

---

## Key UX logic

- **Readiness score**: always shown as % vs 67% ABRSM pass mark
- **Lesson time allocation**: AI-suggested split across pieces / scales /
  sight-reading / aural — weak areas flagged with ⚠ and allocated more time
- **Triangle of Success**: same progress snapshot rendered with different
  framing per role (teacher sees grading detail; parent sees trend + actions;
  student sees personal heatmap)

---

## Known patterns

- Error boundary: all API calls wrapped in try/catch, show toast on failure
- Auth: `useAuth()` hook manages session state from `GET /api/auth/me`
- BARE_ROUTES: suppresses header/footer for standalone pages
- `location.state` for modal-intent navigation
- `credentials: 'include'` on every fetch
