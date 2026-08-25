# Development Log — 2026-08-25 — Progress Summary Race Condition

## Summary

Today we reproduced and traced a production bug where **Edit Grades** can leave the teacher dashboard's Skill Breakdown and readiness donut stale even though Lesson History and the progress graph show the newly edited scores.

The frontend is not the only source of the bug, but its current concurrent save pattern exposes a backend race condition.

Related backend issue:

```text
SP-express #60
fix: eliminate race condition in lesson progress summary recomputation
```

---

## 1. Production Symptom

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
75.25% → 75%
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
76.75% → 77%
```

Conclusion:

**The donut arithmetic is correct. Its input data is stale.**

---

## 2. Reproduction

A controlled test confirmed:

```text
New lesson creation → dashboard appears correct
Edit Grades         → Skill Breakdown / donut can remain stale
```

A reproduced test state showed:

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

This established a repeatable edit-path regression.

---

## 3. Relevant Frontend Code

`src/hooks/useProgress.js`

`saveScores()` currently performs an optimistic UI update:

```js
setItems(nextItems);
```

and then builds one request per scored progress element:

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

`addScoreEntries()` has the same concurrency pattern:

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

## 4. Why This Exposes the Bug

`Promise.all()` starts the ScoreEntry requests concurrently.

For a Performance cycle the frontend can effectively issue:

```text
POST Piece A
POST Piece B
POST Piece C
POST Piece D
```

At the backend, every one of these writes currently triggers a full `recomputeStudentReadModels()` call.

This creates multiple concurrent recomputations of the same shared derived summary.

Therefore the frontend is not simply "saving four independent records"; it is unintentionally starting four operations that compete to overwrite the same summary.

---

## 5. Why New Lesson Creation Can Look Correct

`saveScores()` immediately executes:

```js
setItems(nextItems);
```

This optimistic state update can make the dashboard display the teacher's newly entered values before the backend's persisted summary has been re-read.

That can mask the backend race.

The inconsistency is more visible after:

- Edit Grades
- reload
- another session/user
- fresh data retrieval

The final architecture should still allow optimistic UI, but it must reconcile with an authoritative backend response.

---

## 6. Frontend Architectural Decision

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
saveScores()

        ↓

PUT /api/lessons/:lessonId/progress

{
  scores: [...]
}

        ↓

backend writes all lesson progress

        ↓

backend recomputes summary once

        ↓

authoritative response

        ↓

React updates local state
```

The frontend's final state should be reconciled from the backend response rather than relying only on optimistic `nextItems`.

---

## 7. Migration Requirements

The new request must preserve all current score-entry metadata.

Performance pieces:

- element ID
- label
- score
- piece criteria
- tempo data where applicable

ABRSM elements:

- Piece A
- Piece B
- Piece C
- Scales
- Sight Reading
- Aural Training
- scales notes
- sight-reading notes
- aural-training notes

The teacher create/edit flows must remain behaviorally unchanged from the user's point of view.

---

## 8. Temporary Mitigation

If a fast production patch is required before the new backend command is ready, change the frontend from concurrent saves:

```js
await Promise.all(promises);
```

to sequential writes:

```js
for (const item of itemsToSave) {
  await saveScoreEntry(item);
}
```

This should prevent the existing backend recomputations from overlapping.

This is intentionally temporary because it:

- keeps multiple HTTP requests;
- recomputes the full summary repeatedly;
- is slower;
- leaves the business operation fragmented.

---

## 9. Frontend Tests Needed

### `saveScores()` request test

After migration, verify:

- one lesson-progress request is sent;
- all scored elements are included;
- lesson ID is included;
- cycle ID is included;
- instrument is included;
- lesson date is included;
- piece criteria are preserved;
- scales notes are preserved;
- sight-reading notes are preserved;
- aural-training notes are preserved.

### Authoritative-response test

Verify React state is updated from the server-confirmed progress response.

### Performance-cycle manual regression

1. Create new lesson.
2. Score A/B/C/D.
3. Save.
4. Confirm:
   - Lesson History
   - graph
   - Skill Breakdown
   - donut
   - sidebar/student progress badge

   all agree.

5. Edit Grades.
6. Change multiple pieces.
7. Save.
8. Confirm all displays update.
9. Hard refresh.
10. Confirm the values remain consistent.

### ABRSM-cycle regression

Repeat for:

- Piece A
- Piece B
- Piece C
- Scales
- Sight Reading
- Aural Training

### Cross-role regression

Confirm parent-facing progress remains correct after teacher edits.

---

## 10. Follow-up

Backend implementation is tracked in:

```text
SP-express #60
```

A frontend companion issue should track migration of `useProgress.saveScores()` from the concurrent multi-request pattern to the new lesson-progress API command.

---

## Key Engineering Lesson

`Promise.all()` is not inherently unsafe.

It is appropriate for independent asynchronous work.

The dangerous case is:

```text
concurrent requests
        +
shared mutable/derived state
        +
read → calculate → overwrite
```

When correctness depends on which asynchronous operation finishes last, the application has a race condition.

For this workflow, the business operation is one lesson save, so the frontend should express it as one lesson-progress command.
