export function getTeacherStudentsFetchMode({ teacherId, loadedTeacherId }) {
  const isInitialLoad = !!teacherId && loadedTeacherId !== teacherId;

  return {
    isInitialLoad,
    isBackgroundRefresh: !!teacherId && !isInitialLoad,
  };
}
