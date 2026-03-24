import { useMemo, useState } from "react";
import ProgressDonut from "../../../components/ProgressDonut/ProgressDonut";
import AssignmentBreakdown from "../../../components/AssignmentBreakdown/AssignmentBreakdown";
import {
  CompleteCycleModal,
  WithdrawCycleModal,
} from "../../../components/ExamCycle/ExamCycleActions";
import AttendanceCalendar from "../attendance/AttendanceCalendar";
import { api } from "../../../lib/api";
import "./TeacherStudentInfo.css";

function cycleStatus(c) {
  return c?.cycleStatus || c?.status || "";
}

export default function TeacherStudentInfo({
  student,
  items = [],
  readiness = 0,
  latestLesson,
  latestLessonLoading,
  onOpenProgress,
  onNewExamCycle,
  examCycleRefreshKey,
  onToast,
  initialCycle,
}) {
  const { id: studentId, _id } = student || {};
  const sid = _id || studentId || "";
  const displayName =
    student?.name ||
    `${student?.firstName || ""} ${student?.lastName || ""}`.trim() ||
    "Unnamed";

  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // initialCycle is resolved by the parent (SelectedStudentPane):
  // either from the history view click or auto-fetched active cycle
  const activeCycle = initialCycle || null;
  const hasActiveCycle = !!activeCycle;
  const activeCycleId = activeCycle?._id || activeCycle?.id || "";
  const activeCycleStatus = cycleStatus(activeCycle);
  const isActiveCycleReadOnly =
    activeCycle &&
    activeCycleStatus !== "current" &&
    activeCycleStatus !== "registered";

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
      const cycleParam = activeCycleId ? `&cycleId=${activeCycleId}` : "";
      const data = await api(`/api/score-entries/student/${sid}?limit=50${cycleParam}`);
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
  const pcs = student.parentContactSnapshot || {};
  const parentName = [pcs.firstName, pcs.lastName].filter(Boolean).join(" ") || "";
  const parentEmail = pcs.email || "";

  return (
    <section className="teacherStudentInfo">
      <header className="tsi__pageHead">
        <div className="tsi__pageTitleWrap">
          <h1 className="tsi__pageTitle">{displayName}</h1>
          <div className="tsi__pageMeta">
            {activeCycle?.examGrade
              ? `Grade ${activeCycle.examGrade}`
              : student.grade
                ? `Grade ${student.grade}`
                : "Grade —"}{" "}
            • {activeCycle?.instrument || student.instrument || "Piano"}
            {activeCycle?.examType ? ` • ${activeCycle.examType}` : ""}
          </div>
        </div>

        <div className="tsi__pageActions">
          {!isActiveCycleReadOnly && (
            <>
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
            </>
          )}
        </div>
      </header>

      {/* Main 2-column layout */}
      <div className="tsi__layout">
        {/* LEFT COLUMN */}
        <div className="tsi__col">
          {!hasActiveCycle && (
            <section className="tsi__cardPaper">
              <p className="tsi__emptyState">
                No active exam cycle. Create one from Progress History to start tracking.
              </p>
            </section>
          )}

          {hasActiveCycle && (
            <>
              {/* Exam progress donut */}
              <section className="tsi__cardPaper tsi__examCard tsi__examCard--dark">
                <div className="tsi__kicker">
                  Exam progress
                  {isActiveCycleReadOnly && (
                    <span className="tsi__readOnlyBadge">
                      {activeCycleStatus}
                    </span>
                  )}
                </div>

                <div className="tsi__examBody">
                  <div className="tsi__donutWrap">
                    <ProgressDonut
                      value={
                        isActiveCycleReadOnly
                          ? Math.round(
                              activeCycle?.progressSummary?.overallReadiness ?? 0,
                            )
                          : readiness
                      }
                      label={isActiveCycleReadOnly ? "Final" : "Ready"}
                      size={176}
                      stroke={14}
                    />
                    <div className="tsi__passMark">
                      <span className="tsi__passKicker">Pass mark</span>
                      <span className="tsi__passVal">67%</span>
                    </div>
                  </div>

                  <div className="tsi__examInfo">
                    <div className="tsi__examMid">
                      <div className="tsi__pillGrid">
                        {[
                          { id: "pieceA", label: "Piece 1" },
                          { id: "pieceB", label: "Piece 2" },
                          { id: "pieceC", label: "Piece 3" },
                          { id: "pieceD", label: "Piece 4" },
                          { id: "scales", label: "Scales" },
                          { id: "sightReading", label: "Sight-read" },
                          { id: "auralTraining", label: "Aural" },
                        ]
                          .filter((p) => {
                            if (p.id === "pieceD") {
                              return activeCycle?.examType === "Performance";
                            }
                            if (
                              ["scales", "sightReading", "auralTraining"].includes(p.id)
                            ) {
                              return activeCycle?.examType !== "Performance";
                            }
                            return true;
                          })
                          .map((p) => {
                            const it = items.find((x) => x.id === p.id);
                            const pct = it
                              ? Math.round(Number(it.score) || 0)
                              : 0;
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
                  </div>
                </div>
              </section>

              {/* Homework section - only for active cycles */}
              {!isActiveCycleReadOnly && (
                <section className="tsi__cardPaper">
                  <div className="tsi__kicker">This week’s homework</div>
                  <div className="tsi__homeworkEmpty">
                    Homework will show here (coming next).
                  </div>
                </section>
              )}

              {/* Student info card */}
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
            </>
          )}
        </div>

        {/* RIGHT COLUMN — when any cycle is active */}
        {hasActiveCycle && (
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
        )}
      </div>

      <AttendanceCalendar
        open={attendanceOpen}
        onClose={() => setAttendanceOpen(false)}
        student={student}
      />

      {completeOpen && activeCycle && (
        <CompleteCycleModal
          cycle={activeCycle}
          onClose={() => setCompleteOpen(false)}
          onSuccess={() => {
            setCompleteOpen(false);
            onToast?.("Exam cycle completed", "success");
          }}
        />
      )}

      {withdrawOpen && activeCycle && (
        <WithdrawCycleModal
          cycle={activeCycle}
          onClose={() => setWithdrawOpen(false)}
          onSuccess={() => {
            setWithdrawOpen(false);
            onToast?.("Exam cycle withdrawn", "warning");
          }}
        />
      )}
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
