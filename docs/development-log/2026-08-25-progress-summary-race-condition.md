# Development Log — 2026-08-25 — Progress Summary Race Condition

> **Updated:** 2026-08-26
> **Related backend issue:** SP-express #60 — `fix: eliminate race condition in lesson progress summary recomputation`

## Summary

A production bug was reported where the teacher dashboard's **Skill Breakdown** and readiness donut did not always match the latest Lesson History / progress graph values.

Initial investigation on 2026-08-25 reproduced stale dashboard state after **Edit Grades** and identified a real concurrency risk in the current save architecture:

- the frontend sends multiple `ScoreEntry` requests concurrently with `Promise.all()`;
- every individual backend score-entry write recomputes the entire student/cycle read model;
- multiple recomputations can therefore overlap and compete to persist shared derived state.

Further investigation on 2026-08-26 showed that the observed behavior is not one single failure mode:

1. A **Test Student** showed stale Skill Breakdown / donut values immediately after Edit Grades, but the values became correct after reopening/reloading the application.
2. **Dilara's affected students** continue to show stale donut / Skill Breakdown values even after a hard refresh.

This means the temporary Test Student failure can involve stale frontend state/refetch behavior, while Dilara's persistent failures point to an additional backend/data-resolution problem.

The race condition remains a valid architectural defect and must be fixed, but it should no longer be treated as the only possible cause of every stale-donut case.

---

## 1. Original Production Symptom

Reported state:

```text
Latest lesson / graph: 77%
Readiness donut:       75%
```

Stale Skill Breakdown:

```text
Piece A = 72%
Piece B = 80%
Piece C = 59%
Piece D = 90%
```

These values correctly produce:

```text
(72 + 80 + 59 + 90) / 4
= 75.25
→ 75%
```

Latest lesson values:

```text
Piece A = 72%
Piece B = 80%
Piece C = 67%
Piece D = 88%
```

These correctly produce:

```text
(72 + 80 + 67 + 88) / 4
= 76.75
→ 77%
```

### Conclusion

**The donut arithmetic is correct. Its input data is stale.**

The problem is therefore upstream of the donut calculation itself.

---

## 2. Reproduction — Revised Finding

### 2026-08-25 observation

A controlled Edit Grades test produced:

```text
Piece A = 67
Piece B = 63
Piece C = 0
Piece D = 0
```

The donut displayed:

```text
33%
```

while the latest progress showed:

```text
51%
```

At the time, this appeared to establish a repeatable edit-path regression.

### 2026-08-26 correction

When the same Test Student was opened again the next day, the donut displayed the correct:

```text
51%
```

This changes the interpretation.

For the Test Student, the stale `33%` state was not persistently stored as the only backend truth. A fresh application load was able to resolve the correct state.

The Test Student case is therefore consistent with a **temporary frontend state/refetch inconsistency**.

However, Dilara's affected students remain incorrect even after a hard refresh.

This indicates at least two observable failure modes:

```text
TEMPORARY STALE UI
Edit Grades
    ↓
React/dashboard state remains stale
    ↓
fresh reload/reopen
    ↓
correct persisted data is fetched
    ↓
UI self-corrects


PERSISTENT STALE DATA
Edit Grades / historical data
    ↓
fresh browser request
    ↓
backend/read model still resolves stale values
    ↓
hard refresh does not help
```

The persistent Dilara case requires a backend/data-history investigation in addition to the race-condition fix.

---

## 3. Relevant Frontend Code

`src/hooks/useProgress.js`

### Optimistic dashboard state

`saveScores()` immediately updates local state:

```js
setItems(nextItems);
```

This can make the UI appear correct before the backend's derived summaries have been persisted and re-read.

### Concurrent ScoreEntry saves

`saveScores()` currently builds one request per scored progress element:

```js
const promises = nextItems
  .filter((it) => it.score != null && it.score > 0)
  .map((it) => {
    return api("/api/score-entries/", {
      method: "POST",
      body,
    });
  });

await Promise.all(promises);
```

`addScoreEntries()` uses the same pattern:

```js
const promises = entries.map((entry) =>
  api("/api/score-entries/", {
    method: "POST",
    body: {
      studentId,
      ...entry,
    },
  }),
);

await Promise.all(promises);
```

---

## 4. Confirmed Concurrency Risk

`Promise.all()` starts the ScoreEntry requests concurrently.

For a Performance cycle the frontend can effectively issue:

```text
POST Piece A
POST Piece B
POST Piece C
POST Piece D
```

The backend currently recomputes the shared read models after every individual ScoreEntry upsert:

```text
POST Piece A
    ↓
upsert A
    ↓
recompute whole summary

POST Piece B
    ↓
upsert B
    ↓
recompute whole summary

POST Piece C
    ↓
upsert C
    ↓
recompute whole summary

POST Piece D
    ↓
upsert D
    ↓
recompute whole summary
```

Because the requests overlap, separate recomputations can observe different partial database states.

Example:

```text
A recompute sees: A=new, B=old, C=old, D=old
B recompute sees: A=new, B=new, C=old, D=old
C recompute sees: A=new, B=new, C=new, D=old
D recompute sees: A=new, B=new, C=new, D=new
```

Completion order is not guaranteed to match start order.

A stale recomputation can therefore finish after a newer recomputation and overwrite shared derived state.

This is a real **application-level race condition / stale-write risk**, even if it is not the sole explanation for every production symptom.

---

## 5. Why New Lesson Creation Can Look Correct

`saveScores()` immediately performs:

```js
setItems(nextItems);
```

This optimistic state update can make newly entered values appear correct immediately.

That means a successful-looking new-lesson workflow does **not** prove that the persisted backend summary is always correct.

The issue may only become visible after:

- Edit Grades;
- reload;
- another user/session;
- a fresh read of derived summary state;
- historical data with ambiguous ScoreEntry records.

The final architecture may keep optimistic UI, but the final state must be reconciled with an authoritative backend response.

---

## 6. New Finding: Domain Timeline Must Be Independent of Audit Timestamps

During investigation, the current summary ordering was reviewed.

The important domain rule is now explicit:

> **Musical progress chronology is defined by the teacher-selected lesson date and lesson time, not by when MongoDB created or updated a document.**

### Domain timeline

```text
lessonDate
    ↓
lessonStartTime
```

### Audit/system metadata

```text
createdAt
updatedAt
```

`createdAt` and `updatedAt` answer:

```text
When did the database record get created?
When was the database record last modified?
```

They do **not** answer:

```text
When did this musical progress happen?
```

Therefore `createdAt` / `updatedAt` should not be used to determine the student's progress chronology.

---

## 7. One True Timeline

The intended StudioPulse timeline is:

```text
Exam Cycle
    ↓
Lesson
    ├── lessonDate
    ├── lessonStartTime
    └── lessonEndTime
          ↓
      ScoreEntries
```

For progress chronology:

```text
PRIMARY:   lessonDate
SECONDARY: lessonStartTime
```

Example:

```text
Aug 25
10:00–10:45  Lesson 1
16:00–16:45  Lesson 2
```

Both lessons legitimately share the same `lessonDate`.

The second lesson is later because its **domain start time** is later.

The tie-breaker must not be `createdAt`.

---

## 8. ScoreEntry Identity Rule

The desired invariant is:

> **One active ScoreEntry per lesson element.**

Conceptually:

```text
lessonId + elementId
    ↓
one active ScoreEntry
```

Example:

```text
Lesson ABC123
├── pieceA → one active ScoreEntry
├── pieceB → one active ScoreEntry
├── pieceC → one active ScoreEntry
└── pieceD → one active ScoreEntry
```

Editing Piece C should update that logical score:

```text
Piece C: 59
    ↓ Edit Grades
Piece C: 67
```

It should not produce two competing active records for the same lesson element.

### Important backend investigation

The current ScoreEntry upsert filter includes `createdByTeacherId`.

That means teacher attribution may currently participate in ScoreEntry identity.

This must be reviewed.

Teacher identity should usually answer:

```text
Who created the score?
Who last edited the score?
```

rather than:

```text
Which logical lesson score is this?
```

A likely cleaner distinction is:

```text
IDENTITY:
lessonId + elementId
(+ required student/cycle integrity fields)

AUDIT:
createdByTeacherId
lastEditedByTeacherId
createdAt
updatedAt
```

No schema/index change should be made until historical production records are inspected and regression tests define the expected behavior.

---

## 9. Persistent Dilara Case — Investigation Required

Dilara's affected students remain incorrect after hard refresh.

This means browser-local stale state is not sufficient to explain those cases.

Before implementing the permanent #60 fix, inspect affected production ScoreEntries for:

```text
_id
studentId
examPreparationCycleId
lessonId
lessonDate
elementId
score
createdByTeacherId
createdAt
updatedAt
archivedAt
```

Specifically determine whether affected elements such as Piece C / Piece D have:

- multiple active ScoreEntries representing the same logical lesson element;
- historical records created under older schema behavior;
- missing or inconsistent `lessonId`;
- different `createdByTeacherId` values for what should be one logical score;
- multiple records on the same `lessonDate`;
- legacy records that cause the current aggregation to select the wrong value.

Compare one affected Dilara student against the clean Test Student.

The goal is to distinguish:

```text
frontend stale-state bug
vs.
race-produced stale summary
vs.
historical ScoreEntry identity/data-resolution bug
```

These may coexist.

---

## 10. Frontend Architectural Decision

The frontend should stop treating one lesson save as several independent ScoreEntry commands.

### Current

```text
saveScores()

        ↓

POST score A
POST score B
POST score C
POST score D

        ↓

Promise.all()
```

### Target

```text
TEACHER ACTION
Save today's progress

        ↓

ONE API COMMAND
saveLessonProgress()

        ↓

backend writes Lesson + ScoreEntries

        ↓

all score writes complete

        ↓

backend recomputes summary ONCE

        ↓

authoritative response

        ↓

React reconciles local state
```

Candidate route:

```text
PUT /api/lessons/:lessonId/progress
```

The exact API contract should be finalized after inspecting the current create/edit lesson flows and the historical ScoreEntry data.

---

## 11. Migration Requirements

The new request must preserve all current score-entry metadata.

### Performance pieces

- element ID;
- label;
- score;
- piece criteria;
- tempo data where applicable.

### ABRSM elements

- Piece A;
- Piece B;
- Piece C;
- Scales;
- Sight Reading;
- Aural Training;
- scales notes;
- sight-reading notes;
- aural-training notes.

The teacher's create/edit workflow should remain behaviorally unchanged from the user's point of view.

---

## 12. Exam-Cycle Timeline Rule — Follow-up Architecture

A separate temporal rule was clarified during this investigation.

Teachers should be able to backlog lessons **only inside the exam-cycle timeframe**.

The intended condition is:

```text
cycleStartDate <= lessonDate <= examDate
```

### Important distinction

`cycleStartDate` should represent **domain time** and should not automatically mean `createdAt`.

A teacher may create a StudioPulse exam cycle after preparation has already begun.

Therefore the future cycle model should support an explicit teacher-selected:

```text
cycleStartDate
```

with a reasonable default such as today's date.

### Existing cycles

Historical cycles need a migration strategy rather than blindly treating `createdAt` as the true cycle start.

This work should be tracked separately from #60 to avoid expanding the production consistency fix into a broader temporal-data refactor.

---

## 13. Lesson Time and Teacher Scheduling Rule — Follow-up Architecture

StudioPulse supports one-on-one music lessons and may legitimately have more than one lesson on the same day.

The platform already has:

```text
lessonStartTime
lessonEndTime
```

The scheduling invariant should be teacher-based:

> **One teacher cannot have two active lessons whose time ranges overlap.**

Two adjacent lessons are valid:

```text
3:00–3:45
3:45–4:30
```

An overlap is invalid:

```text
3:00–3:45
3:30–4:15
```

Standard overlap condition:

```js
newStart < existingEnd && newEnd > existingStart;
```

The backend should be authoritative and return a conflict response when the teacher attempts to create/edit an overlapping lesson.

This logic should eventually live in a reusable scheduling service so future:

- StudioPulse calendar views;
- scheduling workflows;
- external calendar integrations

reuse the same source of truth.

This is a follow-up scheduling feature and should not be added to #60 unless required for the immediate data-consistency fix.

---

## 14. Temporary Mitigation

If a fast production patch is required before the new backend command is ready, change frontend score saves from concurrent:

```js
await Promise.all(promises);
```

to sequential:

```js
for (const item of itemsToSave) {
  await saveScoreEntry(item);
}
```

This prevents the current backend recomputations from overlapping during that one client save operation.

This remains a temporary mitigation because it:

- keeps multiple HTTP requests;
- recomputes the entire summary repeatedly;
- is slower;
- leaves the business operation fragmented;
- does not repair historical ambiguous ScoreEntry data.

---

## 15. Frontend Tests Needed

### `saveScores()` request test

After migration, verify:

- one lesson-progress request is sent;
- all scored elements are included;
- lesson ID is included;
- cycle ID is included;
- instrument is included;
- lesson date is included;
- lesson time data remains consistent;
- piece criteria are preserved;
- scales notes are preserved;
- sight-reading notes are preserved;
- aural-training notes are preserved.

### Authoritative-response test

Verify React state is reconciled from the server-confirmed progress response.

### Temporary stale-state regression

Reproduce Edit Grades and confirm the UI no longer requires reopen/reload to display the authoritative latest state.

### Persistent-data regression

Use fixtures representing historical/duplicate/ambiguous ScoreEntry data and verify the backend resolves the intended lesson score deterministically according to domain identity and lesson chronology.

### Performance-cycle manual regression

1. Create new lesson.
2. Score A/B/C/D.
3. Save.
4. Confirm:
   - Lesson History;
   - graph;
   - Skill Breakdown;
   - donut;
   - sidebar/student progress badge

   all agree.

5. Edit Grades.
6. Change multiple pieces.
7. Save.
8. Confirm all displays update immediately.
9. Hard refresh.
10. Confirm values remain consistent.
11. Reopen the application later and verify the same persisted result.

### ABRSM-cycle regression

Repeat for:

- Piece A;
- Piece B;
- Piece C;
- Scales;
- Sight Reading;
- Aural Training.

### Same-day lesson chronology

Create two lessons on one day at different valid times and verify:

- both are preserved;
- latest lesson selection follows `lessonStartTime`;
- progress chronology does not depend on `createdAt` / `updatedAt`.

### Cross-role regression

Confirm parent-facing progress remains correct after teacher edits.

---

## 16. Backend / Frontend Work Boundary

Backend implementation is tracked in:

```text
SP-express #60
```

A frontend companion issue should track migration of:

```text
useProgress.saveScores()
```

from the concurrent multi-request pattern to the new single lesson-progress API command.

The permanent backend contract should be implemented and tested before the React flow is migrated.

---

## 17. Updated Implementation Order

```text
1. Inspect affected Dilara production data
        ↓
2. Compare against clean Test Student data
        ↓
3. Define/verify ScoreEntry identity invariant
        ↓
4. Add regression tests for current failures
        ↓
5. Implement one lesson-progress backend command
        ↓
6. Write/upsert all ScoreEntries
        ↓
7. Recompute read models exactly once
        ↓
8. Return authoritative progress state
        ↓
9. Migrate useProgress.saveScores()
        ↓
10. Reconcile React state from server response
        ↓
11. Run Performance + ABRSM + Edit Grades regressions
        ↓
12. Verify historical affected data
        ↓
13. Deploy and verify with production test student
```

---

## 18. Architectural Principles

### Business-operation boundary

> **The boundary of a write operation should match the boundary of the business operation.**

The teacher is performing:

```text
Save today's lesson progress
```

not four unrelated commands:

```text
Save Piece A
Save Piece B
Save Piece C
Save Piece D
```

### One true timeline

> **Musical chronology must come from teacher-defined lesson domain time.**

```text
lessonDate
    ↓
lessonStartTime
```

not:

```text
createdAt
updatedAt
```

### Score identity

> **There should be one active logical score for one element in one lesson.**

### Concurrency

`Promise.all()` is not inherently unsafe.

It is appropriate for independent asynchronous work.

The dangerous pattern is:

```text
concurrent operations
        +
shared mutable/derived state
        +
read → calculate → overwrite
```

When correctness depends on which operation finishes last, the application has a race condition.

---

## Current Working Hypothesis

The StudioPulse progress inconsistency may involve more than one defect:

```text
1. Frontend stale state / insufficient reconciliation
2. Concurrent backend summary recomputation race
3. Historical ScoreEntry identity / duplicate-resolution problem
```

#60 should eliminate the unsafe write/recompute architecture.

Before changing ScoreEntry identity or chronology rules, affected production data must be inspected so the permanent fix preserves valid historical lesson progress rather than hiding or rewriting it.
