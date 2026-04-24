import { useEffect, useState, useMemo } from "react";
import { listExamCycles } from "../../lib/examCycleApi";
import {
  sortCycles,
  buildLessonReadiness,
  filterLessonsForCycle,
  useStudentLessons,
} from "./examCycleUtils";
import CycleCompleteWizard from "../ExamCycle/CycleCompleteWizard";
import LessonCard from "../LessonCard/LessonCard";
import "./ExamCycleList.css";

const STATUS_META = {
  current: { label: "Current", className: "ecl__badge--current" },
  registered: { label: "Registered", className: "ecl__badge--registered" },
  completed: { label: "Completed", className: "ecl__badge--completed" },
  withdrawn: { label: "Withdrawn", className: "ecl__badge--withdrawn" },
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ── Sparkline bar chart ── */
function ReadinessSparkline({ data }) {
  if (!data || data.length === 0) {
    return <div className="ecl__sparkEmpty">No lesson data yet</div>;
  }
  return (
    <div className="ecl__sparkWrap">
      <div className="ecl__sparkChart">
        <div className="ecl__sparkPassLine" />
        {data.map((d, i) => {
          const colour =
            d.readiness >= 67
              ? "var(--sage, #7A9E87)"
              : d.readiness >= 50
                ? "var(--gold, #C9A84C)"
                : "var(--rose, #D4806A)";
          return (
            <div key={i} className="ecl__sparkCol">
              <div
                className="ecl__sparkBar"
                style={{
                  height: `${d.readiness}%`,
                  background: colour,
                }}
                title={`L${i + 1}: ${d.readiness}%`}
              />
              <span className="ecl__sparkLabel">L{i + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetaLine({ cycle, status }) {
  const parts = [];
  if (cycle.createdAt) parts.push(`Started ${formatDate(cycle.createdAt)}`);
  if (status === "completed" && cycle.examTaken) {
    parts.push(`Taken ${formatDate(cycle.examTaken)}`);
  }
  if (status === "withdrawn") {
    parts.push(
      `Withdrawn ${cycle.updatedAt ? formatDate(cycle.updatedAt) : ""}`,
    );
  }
  return <div className="ecl__meta">{parts.join(" · ") || "In progress"}</div>;
}

/* ── Individual card (needs hooks, so must be a component) ── */
export function ExamCycleCard({
  cycle,
  studentId,
  allLessons,
  onSelect,
  onComplete,
  onWithdraw,
  onEditLesson,
  readOnly = false,
  hideLessons = false,
}) {
  const id = cycle._id || cycle.id;
  const st = cycle.cycleStatus || cycle.status;
  const meta = STATUS_META[st] || STATUS_META.current;
  const isActive = st === "current" || st === "registered";

  const rawLessons = useMemo(
    () => filterLessonsForCycle(allLessons || [], id),
    [allLessons, id],
  );

  const sparkData = useMemo(
    () => buildLessonReadiness(rawLessons),
    [rawLessons],
  );

  const [lessonsOpen, setLessonsOpen] = useState(false);

  const handleSelect = () => onSelect?.(cycle);
  const handleCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect();
    }
  };

  return (
    <div className="ecl__item" role="listitem">
      <div
        className="ecl__card"
        role="button"
        tabIndex={0}
        onClick={handleSelect}
        onKeyDown={handleCardKeyDown}
      >
        <div className="ecl__header">
          <span className="ecl__headerLabel">
            {cycle.instrument || "Piano"} · ABRSM
          </span>
          <span className={`ecl__badge ${meta.className}`}>{meta.label}</span>
        </div>

        <div className="ecl__gradeType">
          Grade {cycle.examGrade ?? "—"} {cycle.examType || "Practical"}
        </div>
        <MetaLine cycle={cycle} status={st} />

        <ReadinessSparkline data={sparkData} />

        {isActive && !readOnly && (
          <div className="ecl__actions">
            <button
              type="button"
              className="ecl__actionBtn ecl__actionBtn--complete"
              onClick={(e) => {
                e.stopPropagation();
                onComplete?.(cycle);
              }}
            >
              ✓ Complete
            </button>
            <button
              type="button"
              className="ecl__actionBtn ecl__actionBtn--withdraw"
              onClick={(e) => {
                e.stopPropagation();
                onWithdraw?.(cycle);
              }}
            >
              ✕ Withdraw
            </button>
          </div>
        )}

        {!hideLessons && rawLessons && rawLessons.length > 0 && (
          <>
            <button
              className="exam-cycle-view-lessons"
              onClick={(e) => {
                e.stopPropagation();
                setLessonsOpen((v) => !v);
              }}
            >
              <span className={lessonsOpen ? "open" : ""}>▾</span>
              {lessonsOpen
                ? "Hide Lessons"
                : `View ${rawLessons.length} Lessons`}
            </button>

            <div className={`exam-cycle-lessons${lessonsOpen ? " open" : ""}`}>
              {rawLessons.map((lesson) => (
                <LessonCard
                  key={lesson._id || lesson.id}
                  lesson={lesson}
                  readOnly={readOnly}
                  onEditLesson={onEditLesson}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ExamCycleList({
  studentId,
  studentName,
  onSelect,
  refreshKey,
  onCyclesLoaded,
  onCycleAction,
  onEditLesson,
}) {
  const { lessons: allLessons } = useStudentLessons(studentId);
  const [cycles, setCycles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wizardCycle, setWizardCycle] = useState(null);
  const [wizardStartWithdraw, setWizardStartWithdraw] = useState(false);

  const sorted = useMemo(() => sortCycles(cycles), [cycles]);

  useEffect(() => {
    if (!studentId) {
      setCycles([]);
      setIsLoading(false);
      onCyclesLoaded?.([]);
      return;
    }

    let alive = true;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await listExamCycles(studentId);
        if (!alive) return;
        const list = Array.isArray(data) ? data : (data?.cycles ?? []);
        setCycles(list);
        onCyclesLoaded?.(list);
      } catch (e) {
        if (!alive) return;
        if (e?.status === 404) {
          setCycles([]);
          onCyclesLoaded?.([]);
        } else {
          setError(e);
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [studentId, refreshKey]);

  if (isLoading) {
    return (
      <div className="ecl">
        <div className="ecl__loading">Loading exam cycles…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ecl">
        <div className="ecl__error">Failed to load exam cycles.</div>
      </div>
    );
  }

  if (cycles.length === 0) {
    return (
      <div className="ecl">
        <div className="ecl__empty">
          No exam cycles yet. Create one to start tracking progress.
        </div>
      </div>
    );
  }

  return (
    <div className="ecl">
      <div className="ecl__grid" role="list">
        {sorted.map((c) => (
          <ExamCycleCard
            key={c._id || c.id}
            cycle={c}
            studentId={studentId}
            allLessons={allLessons}
            onSelect={onSelect}
            onEditLesson={onEditLesson}
            onComplete={(cycle) => {
              setWizardStartWithdraw(false);
              setWizardCycle(cycle);
            }}
            onWithdraw={(cycle) => {
              setWizardStartWithdraw(true);
              setWizardCycle(cycle);
            }}
          />
        ))}
      </div>

      {wizardCycle && (
        <CycleCompleteWizard
          cycle={wizardCycle}
          studentName={studentName}
          startOnWithdraw={wizardStartWithdraw}
          onClose={() => setWizardCycle(null)}
          onSuccess={() => {
            setWizardCycle(null);
            onCycleAction?.("Exam cycle completed", "success");
          }}
          onWithdrawSuccess={() => {
            setWizardCycle(null);
            onCycleAction?.("Exam cycle withdrawn", "warning");
          }}
        />
      )}
    </div>
  );
}
