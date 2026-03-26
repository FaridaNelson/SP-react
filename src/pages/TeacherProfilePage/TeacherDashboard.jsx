import { useCallback, useEffect, useMemo, useState } from "react";
import { useTeacherStudents } from "../../hooks/useTeacherStudents";
import { useProgress } from "../../hooks/useProgress";
import { computeReadiness } from "../../lib/progress";
import { api } from "../../lib/api";
import { useLatestLesson } from "./hooks/useLatestLesson";
import TeacherStudentInfo from "./views/TeacherStudentInfo";
import ProgressPanel from "./panels/ProgressPanel/ProgressPanel";
import AddStudentModal from "./modals/AddStudentModal";
import ExamCycleWizard from "../../components/ExamCycle/ExamCycleWizard";
import ExamCycleList from "../../components/ExamCycle/ExamCycleList";
import { listExamCycles } from "../../lib/examCycleApi";
import Toast from "../../components/ui/Toast";
import "./TeacherDashboard.css";
import BrandTag from "../../components/BrandTag/BrandTag";
import StudentInformationView from "./views/StudentInformationView";
import StudentDropdownMenu from "./components/StudentDropdownMenu";
import OnboardingGuide from "../../components/OnboardingGuide/OnboardingGuide";

/** Compose a display name from whichever fields are available. */
function studentDisplayName(s) {
  return (
    s.name || `${s.firstName || ""} ${s.lastName || ""}`.trim() || "Unnamed"
  );
}

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

function cycleIsActive(c) {
  const s = c.cycleStatus || c.status;
  return s === "current" || s === "registered";
}

function SelectedStudentPane({
  student,
  progressOpen,
  onOpenProgress,
  onCloseProgress,
  onToast,
  initialCycle,
  onGoToHistory,
}) {
  const studentId = student?._id || student?.id;

  const { items, saveScores, isLoading } = useProgress(studentId);

  const readiness = useMemo(() => computeReadiness(items), [items]);

  const {
    latestLesson,
    setLatestLesson,
    isLoading: latestLoading,
  } = useLatestLesson(studentId, { enabled: !!studentId });

  const [wizardOpen, setWizardOpen] = useState(false);
  const [examCycleRefreshKey, setExamCycleRefreshKey] = useState(0);

  // Fetch cycles once at student level, find active one
  const [fetchedCycle, setFetchedCycle] = useState(null);
  const [cyclesFetched, setCyclesFetched] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    // Don't fetch if parent already provided a cycle from history view
    if (initialCycle) {
      setFetchedCycle(null);
      setCyclesFetched(true);
      return;
    }
    let cancelled = false;
    setCyclesFetched(false);
    listExamCycles(studentId)
      .then((data) => {
        if (cancelled) return;
        const cycles = Array.isArray(data) ? data : (data?.cycles ?? []);
        const active = cycles.find(cycleIsActive);
        setFetchedCycle(active || null);
        setCyclesFetched(true);
      })
      .catch(() => {
        if (!cancelled) setCyclesFetched(true);
      });
    return () => {
      cancelled = true;
    };
  }, [studentId, initialCycle]);

  // The cycle to pass down: prefer initialCycle (from history), else auto-fetched
  const resolvedCycle = initialCycle || fetchedCycle;

  const handleExamCycleCreated = useCallback(() => {
    setWizardOpen(false);
    setExamCycleRefreshKey((k) => k + 1);
    // Re-fetch cycles so snapshot picks up the new one
    if (studentId) {
      listExamCycles(studentId)
        .then((data) => {
          const cycles = Array.isArray(data) ? data : (data?.cycles ?? []);
          const active = cycles.find(cycleIsActive);
          setFetchedCycle(active || null);
        })
        .catch(() => {});
    }
    onToast?.("Exam cycle created", "success");
  }, [onToast, studentId]);

  const handleExamCycleAction = useCallback(
    (message, variant) => {
      setExamCycleRefreshKey((k) => k + 1);
      // Re-fetch cycles after complete/withdraw
      if (studentId) {
        listExamCycles(studentId)
          .then((data) => {
            const cycles = Array.isArray(data) ? data : (data?.cycles ?? []);
            const active = cycles.find(cycleIsActive);
            setFetchedCycle(active || null);
          })
          .catch(() => {});
      }
      onToast?.(message, variant);
    },
    [onToast, studentId],
  );

  const handleNewExamCycle = useCallback(async () => {
    try {
      const data = await listExamCycles(studentId);
      const cycles = Array.isArray(data) ? data : (data?.cycles ?? []);
      const instrument = student?.instrument || "Piano";
      const active = cycles.find(
        (c) => cycleIsActive(c) && c.instrument === instrument,
      );
      if (active) {
        onToast?.(
          `${studentDisplayName(student)} already has an active Grade ${active.examGrade} ${active.instrument || instrument} cycle. Complete or withdraw it before starting a new one.`,
          "warning",
        );
        return;
      }
    } catch {
      // If the check fails, allow opening the wizard
    }
    setWizardOpen(true);
  }, [studentId, student, onToast]);

  if (isLoading || !cyclesFetched) {
    return (
      <div style={{ padding: 22 }}>
        <p>Loading {studentDisplayName(student)}…</p>
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
        onNewExamCycle={handleNewExamCycle}
        examCycleRefreshKey={examCycleRefreshKey}
        onToast={handleExamCycleAction}
        initialCycle={resolvedCycle}
        onGoToHistory={onGoToHistory}
      />

      <ProgressPanel
        open={progressOpen}
        onClose={onCloseProgress}
        student={student}
        items={items}
        onSaveScores={saveScores}
        onLessonSaved={(saved) => setLatestLesson(saved)}
        activeCycle={resolvedCycle}
      />

      {wizardOpen && (
        <ExamCycleWizard
          studentId={studentId}
          instrument={student?.instrument}
          onSuccess={handleExamCycleCreated}
          onClose={() => setWizardOpen(false)}
        />
      )}
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
  const teacherId = user?._id || user?.id;
  const { students, isLoading, error } = useTeacherStudents(teacherId);

  const [roster, setRoster] = useState([]);
  const [greeting, setGreeting] = useState(() => getPacificGreeting());
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Mobile collapsible student list
  const [studentsExpanded, setStudentsExpanded] = useState(false);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant, key: Date.now() });
  }, []);

  // TeacherDashboard controls panel open state
  const [progressOpen, setProgressOpen] = useState(false);

  // snapshot | history | info
  const [view, setView] = useState("snapshot");
  // Cycle selected from the history view to show in snapshot
  const [selectedCycle, setSelectedCycle] = useState(null);
  // Wizard opened from history view
  const [historyWizardOpen, setHistoryWizardOpen] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  useEffect(() => setRoster(students), [students]);

  const filteredRoster = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roster;

    return roster.filter((s) => {
      const name = studentDisplayName(s).toLowerCase();
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
      const created = await api("/api/students/", {
        method: "POST",
        body: payload,
      });
      const real = created?.student || created;
      // Normalise name for sidebar display
      if (!real.name && (real.firstName || real.lastName)) {
        real.name = [real.firstName, real.lastName].filter(Boolean).join(" ");
      }
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

  return (
    <main className="td__shell">
      <div className="td__grid">
        {/* LEFT SIDEBAR — renders inline on mobile */}
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
            <button
              type="button"
              className="td__sectionToggle"
              onClick={() => setStudentsExpanded((v) => !v)}
            >
              <span className="td__sectionToggleIcon">
                {studentsExpanded ? "▴" : "▾"}
              </span>{" "}
              Your students
            </button>
            <div className="td__sectionTitle">Your students</div>
            <button
              className="td__addStudent td__addStudent--desktop"
              onClick={() => setAddOpen(true)}
            >
              + Add student
            </button>
          </div>

          <div
            className={`td__studentListWrap ${studentsExpanded ? "td__studentListWrap--expanded" : ""}`}
          >
            <button
              className="td__addStudent td__addStudent--mobile"
              onClick={() => setAddOpen(true)}
            >
              + Add student
            </button>
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
                          setSelectedCycle(null);
                          setView("snapshot");
                          setStudentsExpanded(false);
                        }}
                      >
                        <div
                          className="td__avatar"
                          style={{
                            background: avatarGradient(studentDisplayName(s)),
                          }}
                        >
                          {initials(studentDisplayName(s))}
                        </div>

                        <div className="td__studentMain">
                          <div className="td__studentName">
                            {studentDisplayName(s)}
                          </div>
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
                          onClearCycle={() => setSelectedCycle(null)}
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
            <OnboardingGuide onAddStudent={() => setAddOpen(true)} />
          ) : view === "snapshot" ? (
            <SelectedStudentPane
              student={selectedStudent}
              progressOpen={progressOpen}
              onOpenProgress={() => setProgressOpen(true)}
              onCloseProgress={() => setProgressOpen(false)}
              onToast={showToast}
              initialCycle={selectedCycle}
              onGoToHistory={() => setView("history")}
            />
          ) : view === "history" ? (
            <div className="td__historyView">
              <header className="td__historyHead">
                <h2 className="td__historyTitle">
                  Exam Cycles — {studentDisplayName(selectedStudent)}
                </h2>
                <button
                  type="button"
                  className="td__pillBtn td__pillBtn--gold"
                  onClick={async () => {
                    const sid = selectedStudent._id || selectedStudent.id;
                    try {
                      const data = await listExamCycles(sid);
                      const cycles = Array.isArray(data)
                        ? data
                        : (data?.cycles ?? []);
                      const instrument = selectedStudent?.instrument || "Piano";
                      const active = cycles.find(
                        (c) => cycleIsActive(c) && c.instrument === instrument,
                      );
                      if (active) {
                        showToast(
                          `${studentDisplayName(selectedStudent)} already has an active Grade ${active.examGrade} ${active.instrument || instrument} cycle. Complete or withdraw it before starting a new one.`,
                          "warning",
                        );
                        return;
                      }
                    } catch {
                      // allow opening wizard on check failure
                    }
                    setHistoryWizardOpen(true);
                  }}
                >
                  + New Exam Cycle
                </button>
              </header>
              <ExamCycleList
                key={historyRefreshKey}
                studentId={selectedStudent._id || selectedStudent.id}
                refreshKey={historyRefreshKey}
                onSelect={(cycle) => {
                  setSelectedCycle(cycle);
                  setView("snapshot");
                }}
                onCyclesLoaded={() => {}}
                onCycleAction={(message, variant) => {
                  setHistoryRefreshKey((k) => k + 1);
                  // Clear selected cycle so snapshot re-fetches active
                  setSelectedCycle(null);
                  showToast(message, variant);
                }}
              />

              {historyWizardOpen && (
                <ExamCycleWizard
                  studentId={selectedStudent._id || selectedStudent.id}
                  instrument={selectedStudent?.instrument}
                  onSuccess={() => {
                    setHistoryWizardOpen(false);
                    setHistoryRefreshKey((k) => k + 1);
                    showToast("Exam cycle created", "success");
                  }}
                  onClose={() => setHistoryWizardOpen(false)}
                />
              )}
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

      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          variant={toast.variant}
          onDone={() => setToast(null)}
        />
      )}
    </main>
  );
}
