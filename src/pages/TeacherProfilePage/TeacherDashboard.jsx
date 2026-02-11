import { useEffect, useMemo, useState } from "react";
import { useTeacherStudents } from "../../hooks/useTeacherStudents";
import { api } from "../../lib/api";
import TeacherStudentInfo from "./TeacherStudentInfo";
import AttendanceCalendar from "./attendance/AttendanceCalendar";
import AddStudentModal from "./modals/AddStudentModal";
import "./TeacherDashboard.css";

export default function TeacherDashboard({
  selectedStudentId,
  onSelectStudent,
}) {
  const { students, isLoading, error } = useTeacherStudents();

  const [roster, setRoster] = useState([]);
  useEffect(() => setRoster(students), [students]);

  const [addOpen, setAddOpen] = useState(false);
  // Auto-select first student if none chosen yet
  useEffect(() => {
    if (!isLoading && !selectedStudentId && students.length) {
      onSelectStudent?.(students[0]._id || students[0].id);
    }
  }, [isLoading, students, selectedStudentId, onSelectStudent]);

  const selectedStudent = useMemo(
    () => students.find((s) => (s._id || s.id) === selectedStudentId) || null,
    [students, selectedStudentId]
  );

  async function handleCreateStudent(payload) {
    const tempId = `temp_${Date.now()}`;
    const optimistic = { id: tempId, tempId, ...payload };
    setRoster((r) => [...r, optimistic]);

    try {
      const created = await api("/api/teacher/students", {
        method: "POST",
        body: payload,
      });
      const real = created?.student || created;
      const realId = real?._id || real?.id;
      setRoster((r) => r.map((s) => (s.id === tempId ? { ...real } : s)));
      if (realId) onSelectStudent?.(realId);
      //close modal on success
      setAddOpen(false);
    } catch (e) {
      // rollback optimistic row on error
      setRoster((r) => r.filter((s) => s.id !== tempId));
      throw e;
    }
  }

  if (isLoading) {
    return (
      <main className="container">
        <p>Loading...</p>
      </main>
    );
  }

  if (error || roster.length === 0) {
    return (
      <main className="container teacher">
        <section className="teacher__empty">
          <h2>To get started</h2>
          <p>
            Add your first student to begin tracking progress and attendance.
          </p>
          <button
            className="btn-submit"
            type="button"
            onClick={() => setAddOpen(true)}
          >
            Add a student
          </button>
        </section>

        <AddStudentModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSubmit={handleCreateStudent}
        />
      </main>
    );
  }

  return (
    <main className="teacher">
      <div className="container teacher__grid">
        {/* Left: student list */}
        <aside className="teacher__sidebar">
          <div className="teacher__sidehead">
            <h2 className="teacher__title">Your Students</h2>
            <button
              className="teacher__addbtn"
              onClick={() => setAddOpen(true)}
            >
              + Add
            </button>
          </div>
          <ul className="teacherDash__list" role="list">
            {roster.map((s) => {
              const id = s._id || s.id;
              const isActive = id === selectedStudentId;

              return (
                <li key={id}>
                  <button
                    type="button"
                    className={`teacherDash__student ${
                      isActive ? "teacherDash__student--active" : ""
                    }`}
                    onClick={() => onSelectStudent?.(id)}
                    aria-selected={isActive}
                  >
                    {s.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* selected student details */}
        <section className="teacherDash__content">
          {selectedStudent ? (
            <>
              <TeacherStudentInfo student={selectedStudent} />
              <div className="teacher__calendar">
                <AttendanceCalendar student={selectedStudent} />
              </div>
            </>
          ) : (
            <div className="teacher__empty">
              <p>Select a student to view details.</p>
            </div>
          )}
        </section>
      </div>

      <AddStudentModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleCreateStudent}
      />
    </main>
  );
}
