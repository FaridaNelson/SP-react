function normalizeId(value) {
  if (value == null) return "";
  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }
  return String(value);
}

export const LATEST_LESSON_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  LOADED: "loaded",
  ERROR: "error",
};

export function buildLessonContextKey(studentId, activeCycle) {
  return [
    normalizeId(studentId),
    normalizeId(activeCycle?._id || activeCycle?.id),
    activeCycle?.instrument || "",
  ].join(":");
}

export function lessonBelongsToContext(lesson, { studentId, activeCycle }) {
  if (!lesson || !studentId || !activeCycle?._id) return false;

  return (
    normalizeId(lesson.studentId) === normalizeId(studentId) &&
    normalizeId(lesson.examPreparationCycleId) === normalizeId(activeCycle._id)
  );
}

export function getCarryForwardLesson(latestLesson, context) {
  return lessonBelongsToContext(latestLesson, context) ? latestLesson : null;
}

export function canSaveWithLatestLessonLookup({
  isEditing,
  latestLessonStatus,
}) {
  return isEditing || latestLessonStatus === LATEST_LESSON_STATUS.LOADED;
}

export function shouldApplyLatestLessonResponse({
  requestKey,
  currentKey,
  latestLesson,
  context,
}) {
  if (requestKey !== currentKey) return false;
  if (!latestLesson) return true;
  return lessonBelongsToContext(latestLesson, context);
}
