import { useMemo, useState } from "react";
import ProgressDonut from "../../../components/ProgressDonut/ProgressDonut";
import AssignmentBreakdown from "../../../components/AssignmentBreakdown/AssignmentBreakdown";
import CycleCompleteWizard from "../../../components/ExamCycle/CycleCompleteWizard";
import AttendanceCalendar from "../attendance/AttendanceCalendar";
import { api } from "../../../lib/api";
import "./TeacherStudentInfo.css";
import PanelHeader from "../../../components/PanelHeader/PanelHeader";

function cycleStatus(c) {
  return c?.cycleStatus || c?.status || "";
}

function getExamLabel(cycle) {
  if (!cycle) return null;
  const type = cycle.examType;
  if (type === "Performance") return "Performance Exam";
  if (cycle.examDate) {
    const month = new Date(cycle.examDate).getMonth() + 1;
    return month <= 6 ? "Spring Exam" : "Fall Exam";
  }
  return null;
}

function daysToGo(examDate) {
  if (!examDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(examDate);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
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
  onGoToHistory,
  obHoveredStep,
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
      const data = await api(
        `/api/score-entries/student/${sid}?limit=50${cycleParam}`,
      );
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

  // Element label mapping
  const ELEMENT_LABELS = {
    pieceA: "Piece A",
    pieceB: "Piece B",
    pieceC: "Piece C",
    pieceD: "Piece D",
    scales: "Scales",
    sightReading: "Sight Reading",
    auralTraining: "Aural Training",
  };

  const ALL_ELEMENT_IDS = [
    "pieceA",
    "pieceB",
    "pieceC",
    "pieceD",
    "scales",
    "sightReading",
    "auralTraining",
  ];

  const requiredElements = activeCycle?.progressSummary?.requiredElements;
  const elementIds =
    Array.isArray(requiredElements) && requiredElements.length > 0
      ? requiredElements
      : ALL_ELEMENT_IDS.filter((id) => id !== "pieceD");

  const pillElements = elementIds.map((id) => ({
    id,
    label: ELEMENT_LABELS[id] || id,
  }));

  const filteredItems = useMemo(() => {
    const latestScores = activeCycle?.progressSummary?.latestScores || {};
    return elementIds.map((id) => {
      const existing = items.find((it) => it.id === id);
      if (existing) return existing;
      return {
        id,
        label: ELEMENT_LABELS[id] || id,
        weight: 0,
        score: latestScores[id] ?? 0,
      };
    });
  }, [items, elementIds, activeCycle]);

  // Exam card derived data
  const examLabel = getExamLabel(activeCycle);
  const days = daysToGo(activeCycle?.examDate);

  return (
    <section className="teacherStudentInfo">
      <PanelHeader
        displayName={displayName}
        subtitle={`${activeCycle?.examGrade ? `Grade ${activeCycle.examGrade}` : student.grade ? `Grade ${student.grade}` : "Grade —"} • ${activeCycle?.instrument || student.instrument || "Piano"}${activeCycle?.examType ? ` • ${activeCycle.examType}` : ""}`}
        onOpenProgress={onOpenProgress}
        obHoveredStep={obHoveredStep}
        showActions={!isActiveCycleReadOnly && hasActiveCycle}
      />
      {/* Main 2-column layout */}
      <div className="tsi__layout">
        {/* LEFT COLUMN */}
        <div className="tsi__col">
          {!hasActiveCycle && (
            <section className="tsi__cardPaper">
              <p className="tsi__emptyState">
                No active exam cycle.{" "}
                {onGoToHistory ? (
                  <>
                    Go to{" "}
                    <button
                      type="button"
                      className="tsi__linkBtn"
                      onClick={onGoToHistory}
                    >
                      Progress History
                    </button>{" "}
                    to create one.
                  </>
                ) : (
                  "Go to Progress History to create one."
                )}
              </p>
            </section>
          )}

          {hasActiveCycle && (
            <>
              {/* Exam progress donut — enriched */}
              <section className="tsi__cardPaper tsi__examCard tsi__examCard--dark">
                {/* Grade + instrument label */}
                <div className="tsi__examGradeLabel">
                  GRADE {activeCycle?.examGrade ?? "—"}{" "}
                  {(activeCycle?.instrument || "Piano").toUpperCase()}
                </div>

                {/* Exam name */}
                {examLabel && <div className="tsi__examName">{examLabel}</div>}

                {/* Exam date */}
                {activeCycle?.examDate && (
                  <div className="tsi__examDate">
                    {new Date(activeCycle.examDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </div>
                )}

                {isActiveCycleReadOnly && (
                  <span className="tsi__readOnlyBadge">
                    {activeCycleStatus}
                  </span>
                )}

                <div className="tsi__examBody">
                  <div className="tsi__donutWrap">
                    <ProgressDonut
                      value={
                        isActiveCycleReadOnly
                          ? Math.round(
                              activeCycle?.progressSummary?.overallReadiness ??
                                0,
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
                        {pillElements.map((p) => {
                          const it = filteredItems.find((x) => x.id === p.id);
                          const pct = it
                            ? Math.round(Number(it.score) || 0)
                            : 0;
                          const pass = pct >= 67;
                          return (
                            <span
                              key={p.id}
                              className={`tsi__pill ${pass ? "tsi__pill--pass" : "tsi__pill--fail"}`}
                              title={`${pct}%`}
                            >
                              {pass ? "✓ " : "○ "}
                              {p.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Days to go */}
                    {days != null && (
                      <div className="tsi__daysToGo">
                        {days > 0
                          ? `${days} DAYS TO GO`
                          : days === 0
                            ? "EXAM TODAY"
                            : "EXAM DATE PASSED"}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Action buttons — below the exam card */}
              {!isActiveCycleReadOnly && (
                <div className="tsi__cycleActions">
                  <button
                    type="button"
                    className="tsi__cycleBtn tsi__cycleBtn--complete"
                    onClick={() => setCompleteOpen(true)}
                  >
                    ✓ Complete this cycle
                  </button>
                  <button
                    type="button"
                    className="tsi__cycleBtn tsi__cycleBtn--withdraw"
                    onClick={() => setWithdrawOpen(true)}
                  >
                    ✕ Withdraw from this cycle
                  </button>
                </div>
              )}

              {/* Homework section - only for active cycles */}
              {!isActiveCycleReadOnly && (
                <section className="tsi__cardPaper">
                  <div className="tsi__kicker">This week's homework</div>
                  <div className="tsi__homeworkEmpty">
                    Homework will show here (coming next).
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        {/* RIGHT COLUMN */}
        {hasActiveCycle && (
          <div className="tsi__col">
            <AssignmentBreakdown
              items={filteredItems}
              subtitle="This component compiles progress entered in Today's progress."
              animateKey={sid}
            />

            <section className="tsi__cardPaper tsi__noteCard">
              <div className="tsi__kicker">Teacher's note</div>
              {latestLessonLoading ? (
                <div className="tsi__noteBody">Loading latest note…</div>
              ) : latestLesson?.teacherNarrative ? (
                <div className="tsi__noteBody">
                  {latestLesson.teacherNarrative}
                </div>
              ) : (
                <div className="tsi__noteBody tsi__muted">
                  No teacher note yet. Add one in Today's progress.
                </div>
              )}
            </section>

            <section className="tsi__cardPaper tsi__nextLesson">
              <div className="tsi__kicker">Next lesson</div>
              <div className="tsi__nextLessonBody">
                Upcoming lesson card (coming next).
              </div>
            </section>

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
                                  <strong>Articulation:</strong>{" "}
                                  {h.articulation}
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
        <CycleCompleteWizard
          cycle={activeCycle}
          studentName={displayName}
          onClose={() => setCompleteOpen(false)}
          onSuccess={() => {
            setCompleteOpen(false);
            onToast?.("Cycle completed", "success");
          }}
          onWithdrawSuccess={() => {
            setCompleteOpen(false);
            onToast?.("Cycle withdrawn", "warning");
          }}
        />
      )}

      {withdrawOpen && activeCycle && (
        <CycleCompleteWizard
          cycle={activeCycle}
          studentName={displayName}
          startOnWithdraw
          onClose={() => setWithdrawOpen(false)}
          onSuccess={() => {
            setWithdrawOpen(false);
            onToast?.("Cycle completed", "success");
          }}
          onWithdrawSuccess={() => {
            setWithdrawOpen(false);
            onToast?.("Cycle withdrawn", "warning");
          }}
        />
      )}
    </section>
  );
}
