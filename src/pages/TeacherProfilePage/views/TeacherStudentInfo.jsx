import { useMemo, useState } from "react";
import ProgressDonut from "../../../components/ProgressDonut/ProgressDonut";
import AssignmentBreakdown from "../../../components/AssignmentBreakdown/AssignmentBreakdown";
import AttendanceCalendar from "../attendance/AttendanceCalendar";
import { api } from "../../../lib/api";
import "./TeacherStudentInfo.css";

export default function TeacherStudentInfo({
  student,
  items = [],
  readiness = 0,
  latestLesson,
  latestLessonLoading,
  onOpenProgress,
}) {
  const { id: studentId, _id, name } = student || {};
  const sid = _id || studentId || "";

  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const grouped = useMemo(() => {
    const groups = new Map();

    for (const h of history) {
      const d = h.lessonDate || h.createdAt;
      const dt = d ? new Date(d) : null;
      const key = dt
        ? `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`
        : "unknown";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(h);
    }

    return Array.from(groups.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, entries]) => ({
        date,
        entries: entries.sort(
          (x, y) =>
            new Date(y.createdAt || y.lessonDate) -
            new Date(x.createdAt || x.lessonDate),
        ),
      }));
  }, [history]);

  async function loadHistory() {
    if (!sid) return;
    setHistoryLoading(true);
    try {
      const data = await api(`/api/teacher/students/${sid}/scores?limit=50`);
      setHistory(Array.isArray(data) ? data : data.items || data.entries || []);
    } catch (e) {
      console.error("Failed to load score history", e);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }

  if (!student) {
    return (
      <div className="teacherStudentInfo teacherStudentInfo--empty">
        <p>Select a student.</p>
      </div>
    );
  }

  const inviteCode = (student.inviteCode || "").toString().toUpperCase();
  const email = student.email || "";
  const parentName = student.parent?.name || student.parentName || "";
  const parentEmail = student.parent?.email || student.parentEmail || "";

  return (
    <section className="teacherStudentInfo">
      <header className="tsi__pageHead">
        <div className="tsi__pageTitleWrap">
          <h1 className="tsi__pageTitle">{name}</h1>
          <div className="tsi__pageMeta">
            {student.grade ? `Grade ${student.grade}` : "Grade —"} •{" "}
            {student.instrument || "Piano"}
          </div>
        </div>

        <div className="tsi__pageActions">
          <button type="button" className="td__pillBtn">
            <span className="td__pillIcon">📅</span> Schedule a lesson
          </button>

          <button type="button" className="td__pillBtn td__pillBtn--dark">
            ✉️ Message parent
          </button>

          <button
            type="button"
            className="td__pillBtn td__pillBtn--gold"
            onClick={onOpenProgress}
          >
            ✏️ Today’s progress
          </button>
        </div>
      </header>

      {/* Main 2-column layout */}
      <div className="tsi__layout">
        {/* LEFT COLUMN */}
        <div className="tsi__col">
          {/* Exam progress card */}
          <section className="tsi__cardPaper tsi__examCard tsi__examCard--dark">
            <div className="tsi__kicker">Exam progress</div>

            <div className="tsi__examBody">
              <div className="tsi__donutWrap">
                <ProgressDonut
                  value={readiness}
                  label="Ready"
                  size={176}
                  stroke={14}
                />
                <div className="tsi__passMark">
                  <span className="tsi__passKicker">Pass mark</span>
                  <span className="tsi__passVal">67%</span>
                </div>{" "}
              </div>

              <div className="tsi__examInfo">
                <div className="tsi__examTop">
                  <div className="tsi__examGrade">
                    {student.grade ? (
                      <>
                        Grade{" "}
                        <span className="tsi__gradeNum">{student.grade}</span>
                      </>
                    ) : (
                      "Grade —"
                    )}{" "}
                    {student.instrument || ""}
                  </div>
                  <div className="tsi__examTitle">Spring Exam</div>
                </div>

                {/* These pills can be mapped from your items later.
                  For now, just show a simple row based on known ids. */}
                <div className="tsi__examMid">
                  <div className="tsi__pillGrid">
                    {[
                      { id: "pieceA", label: "Piece 1" },
                      { id: "pieceB", label: "Piece 2" },
                      { id: "pieceC", label: "Piece 3" },
                      { id: "scales", label: "Scales" },
                      { id: "sightReading", label: "Sight-read" },
                      { id: "auralTraining", label: "Aural" },
                    ].map((p) => {
                      const it = items.find((x) => x.id === p.id);
                      const pct = it ? Math.round(Number(it.score) || 0) : 0;
                      const pass = pct >= 67;
                      return (
                        <span
                          key={p.id}
                          className={`tsi__pill ${pass ? "tsi__pill--pass" : "tsi__pill--fail"}`}
                          title={it ? `${pct}%` : "—"}
                        >
                          {pass ? "✓ " : "○ "}
                          {p.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="tsi__examBottom">
                  <div className="tsi__examDate">
                    <strong>Exam date:</strong> 26 March 2026
                  </div>
                  <div className="tsi__examCountdown">
                    <div className="tsi__bigNum">38</div>
                    <div className="tsi__smallTxt">days to go</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Homework section - placeholder, you’ll wire later */}
          <section className="tsi__cardPaper">
            <div className="tsi__kicker">This week’s homework</div>
            <div className="tsi__homeworkEmpty">
              Homework will show here (coming next).
            </div>
          </section>

          {/* Optional: keep your info card here or remove from final design */}
          <section className="tsi__cardPaper">
            <div className="tsi__kicker">Student info</div>
            <div className="tsi__infocardPaper">
              <div className="tsi__infoLine">
                <strong>Email:</strong> {email || "—"}
              </div>
              <div className="tsi__infoLine">
                <strong>Invite code:</strong> {inviteCode || "—"}
              </div>
              <div className="tsi__infoLine">
                <strong>Parent:</strong> {parentName || "—"}
              </div>
              <div className="tsi__infoLine">
                <strong>Parent email:</strong> {parentEmail || "—"}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="tsi__col">
          {/* Skill breakdown (your upgraded AssignmentBreakdown) */}
          <AssignmentBreakdown
            items={items}
            subtitle="This component compiles progress entered in Today’s progress."
            animateKey={sid}
          />

          {/* Teacher’s note - placeholder until latest lesson is wired */}
          <section className="tsi__cardPaper tsi__noteCard">
            <div className="tsi__kicker">Teacher’s note</div>

            {latestLessonLoading ? (
              <div className="tsi__noteBody">Loading latest note…</div>
            ) : latestLesson?.teacherNarrative ? (
              <div className="tsi__noteBody">
                {latestLesson.teacherNarrative}
              </div>
            ) : (
              <div className="tsi__noteBody tsi__muted">
                No teacher note yet. Add one in Today’s progress.
              </div>
            )}
          </section>

          {/* Next lesson - placeholder */}
          <section className="tsi__cardPaper tsi__nextLesson">
            <div className="tsi__kicker">Next lesson</div>
            <div className="tsi__nextLessonBody">
              Upcoming lesson card (coming next).
            </div>
          </section>

          {/* History toggle can live here */}
          <div className="tsi__historyBar">
            <button
              className="td__pillBtn"
              onClick={async () => {
                const next = !historyOpen;
                setHistoryOpen(next);
                if (next) await loadHistory();
              }}
            >
              {historyOpen ? "Hide History" : "Score History"}
            </button>
          </div>

          {historyOpen && (
            <div className="tsi__history">
              {historyLoading ? (
                <p>Loading history…</p>
              ) : history.length === 0 ? (
                <p>No score history yet.</p>
              ) : (
                <div className="tsi__historyCards">
                  {grouped.map((g) => (
                    <section key={g.date} className="tsi__lessonCard">
                      <div className="tsi__lessonCardHead">
                        <h3 className="tsi__lessonTitle">
                          Lesson •{" "}
                          {(() => {
                            const [y, m, d] = g.date.split("-").map(Number);
                            return new Date(y, m - 1, d).toLocaleDateString();
                          })()}
                        </h3>
                        <span className="tsi__lessonMeta">
                          {g.entries.length} entries
                        </span>
                      </div>

                      <ul className="tsi__lessonEntries">
                        {g.entries.map((h) => (
                          <li key={h._id} className="tsi__lessonEntry">
                            <div className="tsi__entryMain">
                              <strong>{h.elementLabel || h.elementId}</strong>
                              {h.score != null ? `: Score: ${h.score}%` : ""}
                              {h.tempoCurrent != null
                                ? ` • Tempo: ${h.tempoCurrent}${h.tempoGoal != null ? `/${h.tempoGoal}` : ""}`
                                : ""}
                            </div>

                            {h.dynamics ? (
                              <div className="tsi__historyNote">
                                <strong>Dynamics:</strong> {h.dynamics}
                              </div>
                            ) : null}

                            {h.articulation ? (
                              <div className="tsi__historyNote">
                                <strong>Articulation:</strong> {h.articulation}
                              </div>
                            ) : null}

                            <div className="tsi__entryTime">
                              {new Date(
                                h.createdAt || h.lessonDate,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AttendanceCalendar
        open={attendanceOpen}
        onClose={() => setAttendanceOpen(false)}
        student={student}
      />
    </section>
  );
}

function InfoRow({ label, value, copyValue }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!copyValue) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="tsi__inforow">
      <div className="tsi__label">{label}</div>
      <div className="tsi__value">
        <span className="tsi__text" title={String(value)}>
          {String(value)}
        </span>
        {copyValue && (
          <button
            type="button"
            className="tsi__copybtn"
            onClick={copy}
            aria-label={`Copy ${label}`}
            data-copied={copied || undefined}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}
