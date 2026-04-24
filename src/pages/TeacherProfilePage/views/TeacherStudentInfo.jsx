import { useMemo, useState } from "react";
import ProgressDonut from "../../../components/ProgressDonut/ProgressDonut";
import AssignmentBreakdown from "../../../components/AssignmentBreakdown/AssignmentBreakdown";
import CycleCompleteWizard from "../../../components/ExamCycle/CycleCompleteWizard";
import AttendanceCalendar from "../attendance/AttendanceCalendar";
import { api } from "../../../lib/api";
import "./TeacherStudentInfo.css";
import PanelHeader from "../../../components/PanelHeader/PanelHeader";
import {
  filterLessonsForCycle,
  buildLessonReadiness,
} from "../../../components/ExamCycle/examCycleUtils";
import ProgressScoreOverTime from "../components/ProgressScoreOverTime/ProgressScoreOverTime";

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

function formatLessonDateLabel(dateValue) {
  if (!dateValue) return "";

  const dateOnly = String(dateValue).slice(0, 10);
  const [year, month, day] = dateOnly.split("-").map(Number);

  if (!year || !month || !day) return "";

  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
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
  allLessons = [],
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
  const [blockedOpen, setBlockedOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const activeCycle = initialCycle || null;
  const hasActiveCycle = !!activeCycle;
  const activeCycleId = activeCycle?._id || activeCycle?.id || "";

  const progressScoreHistory = useMemo(() => {
    if (!activeCycleId) return [];

    const cycleLessons = filterLessonsForCycle(allLessons || [], activeCycleId)
      .slice()
      .sort((a, b) => {
        const aDate = String(a.lessonDate || "").slice(0, 10);
        const bDate = String(b.lessonDate || "").slice(0, 10);

        if (aDate !== bDate) return aDate.localeCompare(bDate);

        // same day → sort by time if exists
        if (a.lessonStartAt && b.lessonStartAt) {
          return (
            new Date(a.lessonStartAt).getTime() -
            new Date(b.lessonStartAt).getTime()
          );
        }

        if (a.lessonStartAt) return -1;
        if (b.lessonStartAt) return 1;

        return 0;
      });

    return cycleLessons
      .filter(
        (lesson) =>
          lesson.lessonTotalScore !== null &&
          lesson.lessonTotalScore !== undefined,
      )
      .map((lesson, index) => {
        // ALWAYS use lessonDate for display (not createdAt)
        const score = Number.isFinite(lesson.lessonTotalScore)
          ? Math.round(lesson.lessonTotalScore)
          : 0;

        return {
          lessonLabel: `L${index + 1}`,
          dateLabel: formatLessonDateLabel(lesson.lessonDate),
          score,
        };
      });
  }, [allLessons, activeCycleId]);

  const activeCycleStatus = cycleStatus(activeCycle);
  const isActiveCycleReadOnly =
    activeCycle &&
    activeCycleStatus !== "current" &&
    activeCycleStatus !== "registered";

  const grouped = useMemo(() => {
    const groups = new Map();
    for (const h of history) {
      const d = h.lessonDate || h.createdAt;
      const raw = h.lessonDate || h.createdAt;

      const dateOnly = raw ? String(raw).slice(0, 10) : null;

      const key = dateOnly || "unknown";
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

  const DEFAULT_WEIGHTS = {
    scales: 14,
    pieceA: 20,
    pieceB: 20,
    pieceC: 20,
    pieceD: 20,
    sightReading: 14,
    auralTraining: 12,
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

    return elementIds.map((id) => ({
      id,
      label: ELEMENT_LABELS[id] || id,
      weight: DEFAULT_WEIGHTS[id] || 0,
      score: latestScores[id] ?? 0,
    }));
  }, [elementIds, activeCycle]);

  const computedReadiness = useMemo(() => {
    if (!filteredItems.length) return 0;
    const weighted = filteredItems.reduce(
      (sum, it) => sum + (Number(it.score) || 0) * (Number(it.weight) || 0),
      0,
    );
    const totalWeight = filteredItems.reduce(
      (sum, it) => sum + (Number(it.weight) || 0),
      0,
    );
    if (!totalWeight) return 0;
    return Math.round(weighted / totalWeight);
  }, [filteredItems]);

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
        onNewCycle={
          hasActiveCycle && !isActiveCycleReadOnly
            ? () => setBlockedOpen(true)
            : onNewExamCycle
        }
      />

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
          <div className="tsi__snapshotGrid">
            <div className="tsi__snapshotCell">
              <div className="tsi__sectionTitle">Exam Progress</div>

              {activeCycleStatus && (
                <span
                  className={`tsi__statusBadge tsi__statusBadge--${activeCycleStatus}`}
                >
                  {activeCycleStatus}
                </span>
              )}

              <section className="tsi__cardPaper tsi__examCard tsi__examCard--dark">
                <div className="tsi__examBody">
                  <div className="tsi__donutWrap">
                    <ProgressDonut
                      value={computedReadiness}
                      label={isActiveCycleReadOnly ? "Final" : "Ready"}
                      stroke={14}
                      maxSize={176}
                    />

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
                  </div>

                  <div className="tsi__examInfo">
                    <div className="tsi__examCardHead">
                      <div className="tsi__examGradeLabel">
                        GRADE {activeCycle?.examGrade ?? "—"}{" "}
                        {(activeCycle?.instrument || "Piano").toUpperCase()}
                      </div>

                      {examLabel && (
                        <div className="tsi__examName">{examLabel}</div>
                      )}
                    </div>

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
                  </div>

                  <div className="tsi__examDivider"></div>
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
              </section>

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
            </div>

            <div className="tsi__snapshotCell">
              <div className="tsi__sectionTitle">Skill Breakdown</div>

              <AssignmentBreakdown
                items={filteredItems}
                subtitle="This component compiles progress entered in Today's progress."
                animateKey={sid}
              />
            </div>

            <div className="tsi__snapshotCell tsi__snapshotCell--full">
              <ProgressScoreOverTime
                title="Progress Score Over Time"
                history={progressScoreHistory}
                currentScore={computedReadiness}
              />
            </div>
          </div>

          <div className="tsi__snapshotGrid">
            <div className="tsi__snapshotCell">
              {!isActiveCycleReadOnly && (
                <section className="tsi__cardPaper">
                  <div className="tsi__kicker">This week's homework</div>
                  <div className="tsi__homeworkEmpty">
                    Homework will show here (coming next).
                  </div>
                </section>
              )}
            </div>
            <div className="tsi__snapshotCell">
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
            </div>
            <div className="tsi__snapshotCell">
              <section className="tsi__cardPaper tsi__nextLesson">
                <div className="tsi__kicker">Next lesson</div>
                <div className="tsi__nextLessonBody">
                  Upcoming lesson card (coming next).
                </div>
              </section>
            </div>
          </div>
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
        </>
      )}

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

      {blockedOpen && activeCycle && (
        <CycleCompleteWizard
          cycle={activeCycle}
          studentName={displayName}
          showBlockedNotice
          onClose={() => setBlockedOpen(false)}
          onSuccess={() => {
            setBlockedOpen(false);
            onToast?.("Cycle completed", "success");
          }}
          onWithdrawSuccess={() => {
            setBlockedOpen(false);
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
