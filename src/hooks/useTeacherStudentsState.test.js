import { describe, expect, it } from "vitest";
import { getTeacherStudentsFetchMode } from "./useTeacherStudentsState";

describe("useTeacherStudents fetch mode", () => {
  it("uses initial loading before a teacher roster has loaded", () => {
    expect(
      getTeacherStudentsFetchMode({
        teacherId: "teacher-1",
        loadedTeacherId: null,
      }),
    ).toEqual({
      isInitialLoad: true,
      isBackgroundRefresh: false,
    });
  });

  it("treats refreshes for an already loaded teacher as background refreshes", () => {
    expect(
      getTeacherStudentsFetchMode({
        teacherId: "teacher-1",
        loadedTeacherId: "teacher-1",
      }),
    ).toEqual({
      isInitialLoad: false,
      isBackgroundRefresh: true,
    });
  });
});
