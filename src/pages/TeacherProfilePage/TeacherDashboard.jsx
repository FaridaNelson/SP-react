import { useEffect, useMemo, useState } from "react";
import { useTeacherStudents } from "../../hooks/useTeacherStudents";
import { useProgress } from "../../hooks/useProgress";
import { computeReadiness } from "../../lib/progress";
import { api } from "../../lib/api";
import { useLatestLesson } from "./hooks/useLatestLesson";
import TeacherStudentInfo from "./TeacherStudentInfo";
import ProgressPanel from "./panels/ProgressPanel/ProgressPanel";
import AddStudentModal from "./modals/AddStudentModal";
import "./TeacherDashboard.css";
import BrandTag from "../../components/BrandTag/BrandTag";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#C9A84C,#D4806A)",
  "linear-gradient(135deg,#7A9E87,#5A7A6A)",
  "linear-gradient(135deg,#A07CC5,#7A5CA0)",
  "linear-gradient(135deg,#C9A84C,#A07820)",
  "linear-gradient(135deg,#D4806A,#B05040)",
];

function avatarGradient(name = "") {
  if (!name) return AVATAR_GRADIENTS[0];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";

  if (parts.length === 1) {
    // single word → first 2 letters
    return parts[0].slice(0, 2).toUpperCase();
  }

  // multiple words → first letter of first two words
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function formatPacificDate() {
  const now = new Date();

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);
}

function formatTeacherDisplayName(user) {
  if (!user) return "";
  const honorific =
    user.honorific || user.salutation || user.title || user.prefix || "";

  const first = user.firstName || "";
  const last = user.lastName || "";

  const base =
    first || last
      ? `${first} ${last}`.trim()
      : (user.name || user.fullName || user.email || "").trim();

  if (!base) return "";

  if (honorific) return `${honorific} ${base}.`.replace(/\s+/g, " ");
  return `${base}.`;
}

function SelectedStudentPane({
  student,
  progressOpen,
  onOpenProgress,
  onCloseProgress,
}) {
  const studentId = student?._id || student?.id;

  const { items, saveScores, isLoading } = useProgress(studentId);

  const readiness = useMemo(() => computeReadiness(items), [items]);

  const {
    latestLesson,
    setLatestLesson,
    isLoading: latestLoading,
  } = useLatestLesson(studentId, { enabled: !!studentId });

  // You can render a nicer skeleton later; for now keep it explicit.
  if (isLoading) {
    return (
      <div style={{ padding: 22 }}>
        <p>Loading {student?.name}…</p>
      </div>
    );
  }

  return (
    <>
      <TeacherStudentInfo
        student={student}
        items={items}
        readiness={readiness}
        onOpenProgress={onOpenProgress}
        latestLesson={latestLesson}
        latestLessonLoading={latestLoading}
      />

      <ProgressPanel
        open={progressOpen}
        onClose={onCloseProgress}
        student={student}
        items={items}
        onSaveScores={saveScores}
        onLessonSaved={(saved) => setLatestLesson(saved)}
      />
    </>
  );
}
// function StudentPctBadge({ studentId }) {
//   const { items, isLoading } = useProgress(studentId);

//   if (isLoading) {
//     return <span className="td__pctBadge td__pctBadge--empty">—</span>;
//   }

//   const pct = computeReadiness(items || []);
//   const tone =
//     pct >= 80 ? "good" : pct >= 67 ? "mid" : pct > 0 ? "bad" : "empty";

//   return (
//     <span className={`td__pctBadge td__pctBadge--${tone}`}>
//       {pct > 0 ? `${pct}%` : "—"}
//     </span>
//   );
// }

export default function TeacherDashboard({
  selectedStudentId,
  onSelectStudent,
  user,
}) {
  const { students, isLoading, error } = useTeacherStudents();

  const [roster, setRoster] = useState([]);
  useEffect(() => setRoster(students), [students]);

  const [addOpen, setAddOpen] = useState(false);

  // TeacherDashboard controls panel open state
  const [progressOpen, setProgressOpen] = useState(false);

  const selectedStudent = useMemo(
    () => roster.find((s) => (s._id || s.id) === selectedStudentId) || null,
    [roster, selectedStudentId],
  );

  async function handleAddStudent(payload) {
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

      setAddOpen(false);
      return real;
    } catch (e) {
      setRoster((r) => r.filter((s) => s.id !== tempId));
      throw e;
    }
  }

  // close panel automatically if student gets deselected
  useEffect(() => {
    if (!selectedStudent) setProgressOpen(false);
  }, [selectedStudent]);

  if (isLoading) {
    return (
      <main className="td__shell">
        <div className="td__loading">Loading…</div>
      </main>
    );
  }

  if (error || roster.length === 0) {
    return (
      <main className="td__shell">
        <div className="td__emptyCard">
          <h2>To get started</h2>
          <p>
            Add your first student to begin tracking progress and attendance.
          </p>
          <button
            className="td__btn td__btn--primary"
            type="button"
            onClick={() => setAddOpen(true)}
          >
            Add a student
          </button>
        </div>

        <AddStudentModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSubmit={handleAddStudent}
        />
      </main>
    );
  }

  return (
    <main className="td__shell">
      <div className="td__grid">
        {/* LEFT SIDEBAR */}
        <aside className="td__sidebar">
          <div className="teacher__brand">
            <BrandTag compact />
          </div>

          <div className="td__greeting">
            <div className="td__greetHi">Good morning,</div>
            <div className="td__greetName">
              {formatTeacherDisplayName(user)}
            </div>
            <div className="td__greetMeta">
              You have {roster.length} students • {formatPacificDate()}
            </div>
          </div>

          <div className="td__searchWrap">
            <input className="td__search" placeholder="Search students…" />
          </div>

          <div className="td__sectionHead">
            <div className="td__sectionTitle">Your students</div>
            <button className="td__addStudent" onClick={() => setAddOpen(true)}>
              + Add student
            </button>
          </div>

          <ul className="td__studentList" role="list">
            {roster.map((s) => {
              const id = s._id || s.id;
              const active = id === selectedStudentId;

              return (
                <li key={id} className="td__studentRow">
                  <button
                    type="button"
                    className={`td__studentBtn ${active ? "is-active" : ""}`}
                    onClick={() => onSelectStudent?.(id)}
                    aria-selected={active}
                  >
                    <div
                      className="td__avatar"
                      style={{ background: avatarGradient(s.name) }}
                    >
                      {initials(s.name)}
                    </div>

                    <div className="td__studentMain">
                      <div className="td__studentName">{s.name}</div>
                      <div className="td__studentMeta">
                        {s.grade ? `Grade ${s.grade}` : "Grade —"} •{" "}
                        {s.instrument || "Piano"}
                      </div>
                    </div>

                    <div className="td__studentRight" aria-hidden="true">
                      {active ? <span className="td__activeDot" /> : null}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="td__sidebarFade" />
        </aside>

        {/* MAIN CANVAS */}
        <section className="td__main">
          <header className="td__topbar">
            <div className="td__topbarSpacer" />

            <div className="td__topActions">
              <button className="td__pillBtn" disabled={!selectedStudent}>
                <span className="td__pillIcon">📅</span> Schedule a lesson
              </button>

              <button
                className="td__pillBtn td__pillBtn--dark"
                disabled={!selectedStudent}
              >
                ✉️ Message parent
              </button>

              <button
                className="td__pillBtn td__pillBtn--gold"
                disabled={!selectedStudent}
                onClick={() => setProgressOpen(true)}
              >
                ✏️ Today’s progress
              </button>
            </div>
          </header>

          {!selectedStudent ? (
            <div className="td__canvasEmpty">
              <div className="td__emptyIcon">▥</div>
              <h2 className="td__emptyTitle">Choose a student from the left</h2>
              <p className="td__emptySub">
                Their full progress will appear here
              </p>
            </div>
          ) : (
            <SelectedStudentPane
              student={selectedStudent}
              progressOpen={progressOpen}
              onOpenProgress={() => setProgressOpen(true)}
              onCloseProgress={() => setProgressOpen(false)}
            />
          )}
        </section>
      </div>

      <AddStudentModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddStudent}
      />
    </main>
  );
}
