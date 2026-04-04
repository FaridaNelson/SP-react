import { useEffect, useState, useMemo } from "react";
import { listExamCycles } from "../../lib/examCycleApi";
import { api } from "../../lib/api";
import { sortCycles, buildLessonReadiness, DEFAULT_WEIGHTS } from "./examCycleUtils";
import CycleCompleteWizard from "../ExamCycle/CycleCompleteWizard";
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

/* ── Hook: fetch lessons for a cycle ── */
function useCycleLessons(studentId, cycleId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId || !cycleId) {
      setData(null);
      return;
    }
    let alive = true;
    setLoading(true);
    api(`/api/lessons/student/${studentId}`)
      .then((res) => {
        if (!alive) return;
        const lessons = Array.isArray(res) ? res : (res?.items ?? []);
        const filtered = lessons.filter(
          (l) => String(l.examPreparationCycleId) === String(cycleId),
        );
        setData(buildLessonReadiness(filtered));
      })
      .catch(() => {
        if (alive) setData([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [studentId, cycleId]);

  return { data, loading };
}

function MetaLine({ cycle, status }) {
  const parts = [];
  if (cycle.createdAt) parts.push(`Started ${formatDate(cycle.createdAt)}`);
  if (status === "completed" && cycle.examTaken) {
    parts.push(`Taken ${formatDate(cycle.examTaken)}`);
  }
  if (status === "withdrawn") {
    parts.push(`Withdrawn ${cycle.updatedAt ? formatDate(cycle.updatedAt) : ""}`);
  }
  return (
    <div className="ecl__meta">{parts.join(" · ") || "In progress"}</div>
  );
}

/* ── Individual card (needs hooks, so must be a component) ── */
function ExamCycleCard({ cycle, studentId, onSelect, onComplete, onWithdraw }) {
  const id = cycle._id || cycle.id;
  const st = cycle.cycleStatus || cycle.status;
  const meta = STATUS_META[st] || STATUS_META.current;
  const isActive = st === "current" || st === "registered";

  const { data: sparkData } = useCycleLessons(studentId, id);

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
          <span className={`ecl__badge ${meta.className}`}>
            {meta.label}
          </span>
        </div>

        <div className="ecl__body">
          <div className="ecl__gradeType">
            Grade {cycle.examGrade ?? "—"} {cycle.examType || "Practical"}
          </div>
          <MetaLine cycle={cycle} status={st} />

          <ReadinessSparkline data={sparkData} />

          {isActive && (
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
        </div>
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
}) {
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
            onSelect={onSelect}
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
