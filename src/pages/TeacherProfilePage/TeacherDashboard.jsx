import { useEffect, useMemo, useState } from "react";
import { useTeacherStudents } from "../../hooks/useTeacherStudents";
import { useProgress } from "../../hooks/useProgress";
import { computeReadiness } from "../../lib/progress";
import { api } from "../../lib/api";
import { useLatestLesson } from "./hooks/useLatestLesson";
import TeacherStudentInfo from "./views/TeacherStudentInfo";
import ProgressPanel from "./panels/ProgressPanel/ProgressPanel";
import AddStudentModal from "./modals/AddStudentModal";
import "./TeacherDashboard.css";
import BrandTag from "../../components/BrandTag/BrandTag";
import StudentInformationView from "./views/StudentInformationView";
import StudentDropdownMenu from "./components/StudentDropdownMenu";

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

function getPacificGreeting(now = new Date()) {
  // Get the current hour in America/Los_Angeles as a number 0–23
  const hourStr = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    hour12: false,
  }).format(now);

  const hour = Number(hourStr); // 0..23

  if (hour >= 4 && hour <= 11) return "Good morning,";
  if (hour >= 12 && hour <= 17) return "Good afternoon,";
  if (hour >= 18 && hour <= 23) return "Good evening,";
  return "Good night,"; // 0..3
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
  const [greeting, setGreeting] = useState(() => getPacificGreeting());
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  // TeacherDashboard controls panel open state
  const [progressOpen, setProgressOpen] = useState(false);

  // snapshot | history | information
  const [view, setView] = useState("snapshot");

  useEffect(() => setRoster(students), [students]);

  const filteredRoster = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roster;

    return roster.filter((s) => {
      const name = (s.name || "").trim().toLowerCase();
      if (!name) return false;

      // 1) Whole name starts with query (e.g. "ar" matches "Arisa ...")
      if (name.startsWith(q)) return true;

      // 2) Any word starts with query (e.g. "jo" matches "Emma Johnson")
      const words = name.split(/\s+/);
      return words.some((w) => w.startsWith(q));
    });
  }, [roster, query]);

  useEffect(() => {
    const id = setInterval(() => setGreeting(getPacificGreeting()), 60_000);
    return () => clearInterval(id);
  }, []);

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
          <p className="td__emptySub">
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
          <div className="td__greeting">
            <div className="td__greetHi">{greeting}</div>{" "}
            <div className="td__greetName">
              {formatTeacherDisplayName(user)}
            </div>
            <div className="td__greetMeta">
              You have {roster.length} students • {formatPacificDate()}
            </div>
          </div>

          <div className="td__searchWrap">
            <input
              className="td__search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students…"
            />
          </div>

          <div className="td__sectionHead">
            <div className="td__sectionTitle">Your students</div>
            <button className="td__addStudent" onClick={() => setAddOpen(true)}>
              + Add student
            </button>
          </div>

          <div className="td__studentListWrap">
            <ul className="td__studentList" role="list">
              {filteredRoster.map((s) => {
                const id = s._id || s.id;
                const active = id === selectedStudentId;

                return (
                  <li key={id} className="td__studentRow">
                    <div
                      className={`td__studentItem ${active ? "is-active" : ""}`}
                    >
                      <button
                        type="button"
                        className="td__studentBtn"
                        onClick={() => {
                          onSelectStudent?.(id);
                          setView("snapshot");
                        }}
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
                      </button>

                      {active && (
                        <StudentDropdownMenu
                          studentId={id}
                          onSelectStudent={onSelectStudent}
                          setView={setView}
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="td__sidebarFade" />
        </aside>

        {/* MAIN CANVAS */}
        <section className="td__main">
          {!selectedStudent ? (
            <div className="td__canvasEmpty">
              <div className="td__emptyIcon">▥</div>
              <h2 className="td__emptyTitle">Choose a student from the left</h2>
              <p className="td__emptySub">
                Their full progress will appear here
              </p>
            </div>
          ) : view === "snapshot" ? (
            <SelectedStudentPane
              student={selectedStudent}
              progressOpen={progressOpen}
              onOpenProgress={() => setProgressOpen(true)}
              onCloseProgress={() => setProgressOpen(false)}
            />
          ) : view === "history" ? (
            <div style={{ padding: 30 }}>
              <h2>Progress history</h2>
              <p>Coming soon.</p>
            </div>
          ) : (
            <StudentInformationView student={selectedStudent} user={user} />
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
