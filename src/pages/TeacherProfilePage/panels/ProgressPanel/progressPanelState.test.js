import { describe, expect, it } from "vitest";
import {
  LATEST_LESSON_STATUS,
  buildLessonContextKey,
  canSaveWithLatestLessonLookup,
  getCarryForwardLesson,
  shouldApplyLatestLessonResponse,
} from "./progressPanelState";

const cycleA = { _id: "cycle-a", instrument: "Piano" };
const cycleB = { _id: "cycle-b", instrument: "Piano" };

function lesson(overrides = {}) {
  return {
    _id: "lesson",
    studentId: "student-a",
    examPreparationCycleId: "cycle-a",
    lessonDate: "2026-08-30",
    sightReading: { score: 70 },
    auralTraining: { score: 75 },
    ...overrides,
  };
}

describe("ProgressPanel latest lesson state guards", () => {
  it("does not expose previous student data while the next fetch is pending", () => {
    const studentBLesson = lesson({
      studentId: "student-b",
      examPreparationCycleId: "cycle-b",
      sightReading: { score: 80 },
      auralTraining: { score: 85 },
    });

    const carryForwardLesson = getCarryForwardLesson(studentBLesson, {
      studentId: "student-a",
      activeCycle: cycleA,
    });

    expect(carryForwardLesson).toBeNull();
  });

  it("rejects out-of-order latest lesson responses from obsolete contexts", () => {
    const requestKeyB = buildLessonContextKey("student-b", cycleB);
    const requestKeyA = buildLessonContextKey("student-a", cycleA);
    const latestA = lesson();
    const latestB = lesson({
      studentId: "student-b",
      examPreparationCycleId: "cycle-b",
    });

    expect(
      shouldApplyLatestLessonResponse({
        requestKey: requestKeyA,
        currentKey: requestKeyA,
        latestLesson: latestA,
        context: { studentId: "student-a", activeCycle: cycleA },
      }),
    ).toBe(true);

    expect(
      shouldApplyLatestLessonResponse({
        requestKey: requestKeyB,
        currentKey: requestKeyA,
        latestLesson: latestB,
        context: { studentId: "student-b", activeCycle: cycleB },
      }),
    ).toBe(false);
  });

  it("guards create-mode carry-forward against cross-student latest lessons", () => {
    const studentBLesson = lesson({
      studentId: "student-b",
      examPreparationCycleId: "cycle-b",
      sightReading: { score: 80 },
      auralTraining: { score: 85 },
    });

    const carryForwardLesson = getCarryForwardLesson(studentBLesson, {
      studentId: "student-a",
      activeCycle: cycleA,
    });

    expect(carryForwardLesson?.sightReading?.score).toBeUndefined();
    expect(carryForwardLesson?.auralTraining?.score).toBeUndefined();
  });

  it("keeps carry-forward tied to the chronological latest lesson after an older edit", () => {
    const olderSavedLesson = lesson({
      _id: "aug-10",
      lessonDate: "2026-08-10",
      sightReading: { score: 60 },
      auralTraining: { score: 65 },
    });
    const chronologicalLatestLesson = lesson({
      _id: "aug-30",
      lessonDate: "2026-08-30",
      sightReading: { score: 90 },
      auralTraining: { score: 95 },
    });

    const carryForwardLesson = getCarryForwardLesson(chronologicalLatestLesson, {
      studentId: "student-a",
      activeCycle: cycleA,
    });

    expect(carryForwardLesson).toBe(chronologicalLatestLesson);
    expect(carryForwardLesson).not.toBe(olderSavedLesson);
  });

  it("allows same-student same-cycle carry-forward from the actual latest lesson", () => {
    const actualLatestLesson = lesson({
      sightReading: { score: 80 },
      auralTraining: { score: 85 },
    });

    const carryForwardLesson = getCarryForwardLesson(actualLatestLesson, {
      studentId: "student-a",
      activeCycle: cycleA,
    });

    expect(carryForwardLesson?.sightReading?.score).toBe(80);
    expect(carryForwardLesson?.auralTraining?.score).toBe(85);
  });

  it("blocks create saves until the current context latest lesson lookup is loaded", () => {
    const actualLatestLesson = lesson({
      pieces: [{ pieceId: "pieceA", percent: 88 }],
      scales: { percent: 75, items: [{ scaleId: "G-major", ready: true }] },
      sightReading: { score: 80 },
      auralTraining: { score: 85 },
    });

    expect(
      canSaveWithLatestLessonLookup({
        isEditing: false,
        latestLessonStatus: LATEST_LESSON_STATUS.LOADING,
      }),
    ).toBe(false);

    const carryForwardWhileLoading = getCarryForwardLesson(null, {
      studentId: "student-a",
      activeCycle: cycleA,
    });
    expect(carryForwardWhileLoading).toBeNull();

    expect(
      canSaveWithLatestLessonLookup({
        isEditing: false,
        latestLessonStatus: LATEST_LESSON_STATUS.LOADED,
      }),
    ).toBe(true);

    const carryForwardAfterLoaded = getCarryForwardLesson(actualLatestLesson, {
      studentId: "student-a",
      activeCycle: cycleA,
    });

    expect(carryForwardAfterLoaded?.pieces?.[0]?.percent).toBe(88);
    expect(carryForwardAfterLoaded?.scales?.percent).toBe(75);
    expect(carryForwardAfterLoaded?.sightReading?.score).toBe(80);
    expect(carryForwardAfterLoaded?.auralTraining?.score).toBe(85);
  });
});
