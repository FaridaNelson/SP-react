# Development Log — 2026-09-02

## StudioPulse Exam Progress Reconciliation

### Summary

Resolved frontend stale-state issues affecting the teacher Exam Progress dashboard after saving or editing lesson progress.

The backend was already persisting the correct Lesson and ExamCycle data, but several frontend views could temporarily render stale values until the user navigated away or refreshed the browser.

GitHub issue:

- SP-react #106 — `fix: prevent stale Exam Progress after ProgressPanel save`

Pull request:

- SP-react #107 — `fix: reconcile Exam Progress after lesson save`

Status:

- PR #107 merged
- Issue #106 closed
- Fix deployed to production
- Production smoke tests passed

---

## Initial Production Bug

The teacher dashboard could show inconsistent progress immediately after saving a lesson.

Observed behavior included:

- roster/sidebar percentage showing the correct updated progress
- Lesson History showing the correct persisted lesson
- backend ExamCycle summary containing the correct scores
- central Exam Progress donut reverting to `0` or an older value
- Skill Breakdown reverting to stale values
- hard refresh or navigation sometimes correcting the dashboard

A strong reproduction occurred with the first lesson of a new Practical Grade 7 ExamCycle.

The backend returned:

```text
readinessScore: 31.86

latestScores:
pieceA: 20
pieceB: 40
pieceC: 60
scales: 29
sightReading: 10
auralTraining: 20
```

The roster also returned:

```text
activeCycleProgressPercent: 31.86
```

The saved Lesson contained the same scores.

This confirmed that persistence was correct and the remaining problem was frontend state reconciliation.

---

## Root Cause 1 — Background Roster Refresh Unmounted the Dashboard

`useTeacherStudents()` used the same `isLoading` state for both:

- initial teacher roster loading
- background roster refresh after a lesson save

The outer `TeacherDashboard` renders a full-screen `Loading…` state whenever `isLoading === true`.

After `ProgressPanel` saved a lesson:

```text
onLessonSaved()
→ refreshActiveCycle()
→ onRosterRefresh()
→ useTeacherStudents.refresh()
→ setIsLoading(true)
→ TeacherDashboard renders Loading…
→ SelectedStudentPane unmounts
→ freshly fetched ExamCycle state is lost
```

When the dashboard remounted, it could fall back to an older `initialCycle`, causing the donut and Skill Breakdown to revert.

### Fix

Separated first-load state from background refresh state.

`useTeacherStudents()` now tracks:

```text
isLoading
isRefreshing
```

`isLoading` is only used when the teacher roster has not yet loaded for the current teacher.

Subsequent refreshes are treated as background refreshes and keep the selected student workspace mounted.

A helper was added:

```text
src/hooks/useTeacherStudentsState.js
```

with tests in:

```text
src/hooks/useTeacherStudentsState.test.js
```

---

## Root Cause 2 — ExamCycle Refresh Was Not Identity-Aware

The dashboard previously selected the first active cycle after a refresh:

```js
cycles.find(cycleIsActive);
```

This was too broad.

The intended invariant is:

```text
If cycle X is selected,
refresh authoritative cycle X by ID.

If an intentionally selected completed/withdrawn historical cycle is open,
keep that historical cycle selected.

If no cycle is selected,
choose the active current/registered cycle.
```

### Fix

Added:

```text
src/pages/TeacherProfilePage/teacherDashboardState.js
```

with:

```text
cycleIsActive()
normalizeCycleList()
resolveCycleAfterRefresh()
```

`resolveCycleAfterRefresh()` is now identity-first.

Behavior:

```text
selected cycle has ID
→ find same ID in refreshed server response
→ use refreshed object regardless of status

selected historical cycle missing from response
→ preserve original historical object

no selected cycle
→ select current/registered cycle
```

The `SelectedStudentPane` initial-cycle behavior was also changed.

Previously, any `initialCycle` prevented a server refresh.

Now:

```text
completed/withdrawn historical cycle
→ remains stable

current/registered selected cycle
→ refetched from server
→ matched by ID
→ authoritative server object replaces stale copy
```

Regression tests were added in:

```text
src/pages/TeacherProfilePage/teacherDashboardState.test.js
```

---

## Additional Bug Found During Smoke Testing — Sparkline Did Not Refresh

After the main #106 fix was implemented, the following behavior passed:

```text
lesson saves
→ ProgressPanel closes
→ sidebar updates
→ donut updates
→ Skill Breakdown updates
→ donut remains correct
```

However, a new first-lesson smoke test exposed another stale-state source.

Immediately after saving the first lesson:

```text
Progress Score Over Time
→ "No lesson data yet"
```

The lesson was already visible in Progress History.

After navigating to History and returning to Progress Snapshot, the sparkline appeared correctly.

This proved that the Lesson was persisted, but the dashboard's lesson collection had not been refreshed.

### Root Cause

`TeacherDashboard.jsx` used:

```js
const { lessons: allLessons } = useStudentLessons(studentId);
```

The existing `useStudentLessons()` hook already exposed:

```js
refetch();
```

but `TeacherDashboard` was not using it.

The sparkline therefore continued rendering the lesson array fetched before the new lesson was created.

### Fix

Changed the hook usage to:

```js
const { lessons: allLessons, refetch: refetchLessons } =
  useStudentLessons(studentId);
```

Then added lesson reconciliation to the successful save lifecycle:

```js
onLessonSaved={async (saved) => {
  const normalizedSavedLesson = saved?.lesson || saved;

  setLatestLesson(normalizedSavedLesson);

  await refreshActiveCycle();
  await refetchLessons();

  setExamCycleRefreshKey((k) => k + 1);
  onRosterRefresh?.();
}}
```

The final post-save flow is now:

```text
Save Lesson
    ↓
setLatestLesson(saved lesson)
    ↓
refresh authoritative ExamCycle
    ↓
refetch authoritative Lesson collection
    ↓
refresh ExamCycle history
    ↓
background roster refresh
```

This updates all relevant dashboard views without requiring navigation or a browser refresh.

---

## Files Modified

Modified:

```text
src/hooks/useTeacherStudents.js
src/pages/TeacherProfilePage/TeacherDashboard.jsx
```

Added:

```text
src/hooks/useTeacherStudentsState.js
src/hooks/useTeacherStudentsState.test.js
src/pages/TeacherProfilePage/teacherDashboardState.js
src/pages/TeacherProfilePage/teacherDashboardState.test.js
```

No backend/API contract changes were made.

---

## Validation

### Automated Tests

Final local test result:

```text
Test Files: 4 passed
Tests:      25 passed
```

Included:

```text
useTeacherStudentsState.test.js
progressPanelState.test.js
teacherDashboardState.test.js
examCycleUtils.test.js
```

### Static Validation

```text
Touched-file ESLint: PASS
npm run build:         PASS
git diff --check:      PASS
```

The existing Vite large-chunk warning remains unrelated to this change.

---

## Manual Local Smoke Test

Verified:

```text
Save lesson
→ ProgressPanel closes
→ sidebar percentage updates
→ central Exam Progress donut updates
→ Skill Breakdown updates
→ Progress Score Over Time updates immediately
→ donut does not revert
→ no navigation required
→ no hard refresh required
```

The previously discovered cross-student/cross-cycle protections from PR #104 remained intact.

---

## Git / Pull Request

Implementation branch:

```text
fix/stale-exam-progress-reconciliation
```

Implementation commit:

```text
8d66dc3
fix: reconcile exam progress after lesson save
```

PR:

```text
#107
fix: reconcile Exam Progress after lesson save
```

Merged main commit:

```text
38de5be
Merge pull request #107 from FaridaNelson/fix/stale-exam-progress-reconciliation
```

After merge:

```text
local feature branch deleted
remote feature branch deleted
main synced with origin/main
working tree clean
```

---

## PulseForge / OpenClaw Workflow

PulseForge was used in an isolated temporary frontend repository:

```text
~/projects/SP-react-stale-progress-agent
```

Branch:

```text
agent/stale-exam-progress
```

The repository was created from a local Git bundle based on:

```text
SP-react main @ 928dab5
```

No GitHub remote was configured in the agent repository.

PulseForge implemented the main state-reconciliation fix and regression tests.

After review:

- patch was generated from the isolated VM repo
- patch was copied to the Mac
- patch was applied to the local feature branch
- local validation was rerun
- final sparkline fix was added manually on the Mac
- changes were committed and pushed by the developer

After the patch was safely transferred:

- the temporary repository was removed
- the temporary Git bundle was removed
- the temporary patch was removed
- the temporary Docker mount was removed
- the original agent repositories were preserved unchanged

OpenClaw VM was stopped successfully:

```text
openclaw-dev
status: TERMINATED
zone: us-west1-b
```

---

## Production Deployment

Production frontend was rebuilt from:

```text
main @ 38de5be
```

New production bundle:

```text
assets/index-BvPJ61_O.js
```

Previous production bundle:

```text
assets/index-BKQ4WgLb.js
```

The new build was uploaded to the production VM and staged separately before replacing the live directory.

Nginx validation:

```text
nginx configuration syntax is ok
nginx configuration test is successful
```

New asset verification:

```text
HTTP/1.1 200 OK
```

Rollback backup retained:

```text
/var/www/studiopulse.co.backup-20260902-212956
```

---

## Production Smoke Test

Created Lesson 2 in the current ExamCycle.

Verified:

```text
Lesson saves correctly
Dashboard donut refreshes immediately
Skill Breakdown refreshes
Sidebar percentage refreshes
Progress Score Over Time refreshes
No stale rollback occurs
```

### Lesson Snapshot / Historical Edit Validation

Lesson 2 copied Sight Reading `10%` from Lesson 1 during creation.

Then Lesson 1 was edited from:

```text
Sight Reading: 10% → 50%
```

Result:

```text
Lesson 1: 50%
Lesson 2: 10%
Current dashboard: 10%
```

This is the expected behavior.

It confirms an important domain invariant:

```text
Each Lesson is an independent persisted snapshot.

Editing an earlier Lesson must not retroactively mutate a later Lesson.

The current Progress Snapshot reflects the latest Lesson in the current ExamCycle.
```

Therefore, editing Lesson 1 did not change Lesson 2, and the dashboard correctly continued showing Lesson 2's Sight Reading value of `10%`.

---

## Final Status

SP-react #106:

```text
RESOLVED
```

PR #107:

```text
MERGED
DEPLOYED
PRODUCTION VERIFIED
```

Current Exam Progress behavior:

```text
Lesson save
→ authoritative Lesson persisted
→ latest lesson reconciled
→ ExamCycle reconciled
→ Lesson collection reconciled
→ roster refreshed in background
→ dashboard remains mounted
→ donut / Skill Breakdown / sparkline / sidebar remain consistent
```

---

## Follow-up

The backend lesson-progress race tracked separately in SP-express #60 remains a separate architectural task and is not part of this frontend fix.
