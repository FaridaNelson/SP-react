import { useEffect, useState } from "react";
import { listExamCycles } from "../../lib/examCycleApi";
import {
  CompleteCycleModal,
  WithdrawCycleModal,
} from "./ExamCycleActions";
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

function MetaLine({ cycle, status, pct }) {
  if (status === "completed") {
    const parts = [];
    if (cycle.examTaken) parts.push(`Taken ${formatDate(cycle.examTaken)}`);
    if (pct != null) parts.push(`Final score ${pct}%`);
    return <div className="ecl__meta">{parts.join(" · ") || "Completed"}</div>;
  }
  if (status === "withdrawn") {
    return (
      <div className="ecl__meta">
        Withdrawn{cycle.updatedAt ? ` ${formatDate(cycle.updatedAt)}` : ""}
      </div>
    );
  }
  // current / registered
  const parts = [];
  if (cycle.createdAt) parts.push(`Started ${formatDate(cycle.createdAt)}`);
  if (pct != null) parts.push(`${pct}% ready`);
  return <div className="ecl__meta">{parts.join(" · ") || "In progress"}</div>;
}

export default function ExamCycleList({
  studentId,
  onSelect,
  refreshKey,
  onCyclesLoaded,
  onCycleAction,
}) {
  const [cycles, setCycles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [withdrawTarget, setWithdrawTarget] = useState(null);

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
        const list = Array.isArray(data) ? data : data?.cycles ?? [];
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
        {cycles.map((c) => {
          const id = c._id || c.id;
          const st = c.cycleStatus || c.status;
          const meta = STATUS_META[st] || STATUS_META.current;
          const progress = c.progressSummary;
          const pct =
            progress?.overallReadiness != null
              ? Math.round(progress.overallReadiness)
              : null;
          const isActive = st === "current" || st === "registered";

          return (
            <div key={id} className="ecl__item" role="listitem">
              <button
                type="button"
                className="ecl__card"
                onClick={() => onSelect?.(c)}
              >
                {/* Card header — tinted */}
                <div className="ecl__header">
                  <span className="ecl__headerLabel">
                    {c.instrument || "Piano"} · ABRSM
                  </span>
                  <span className={`ecl__badge ${meta.className}`}>
                    {meta.label}
                  </span>
                </div>

                {/* Card body */}
                <div className="ecl__body">
                  <div className="ecl__gradeType">
                    Grade {c.examGrade ?? "—"} {c.examType || "Practical"}
                  </div>
                  <MetaLine cycle={c} status={st} pct={pct} />

                  {isActive && (
                    <div className="ecl__actions">
                      <button
                        type="button"
                        className="ecl__actionBtn ecl__actionBtn--complete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCompleteTarget(c);
                        }}
                      >
                        ✓ Complete
                      </button>
                      <button
                        type="button"
                        className="ecl__actionBtn ecl__actionBtn--withdraw"
                        onClick={(e) => {
                          e.stopPropagation();
                          setWithdrawTarget(c);
                        }}
                      >
                        ✕ Withdraw
                      </button>
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {completeTarget && (
        <CompleteCycleModal
          cycle={completeTarget}
          onClose={() => setCompleteTarget(null)}
          onSuccess={() => {
            setCompleteTarget(null);
            onCycleAction?.("Exam cycle completed", "success");
          }}
        />
      )}

      {withdrawTarget && (
        <WithdrawCycleModal
          cycle={withdrawTarget}
          onClose={() => setWithdrawTarget(null)}
          onSuccess={() => {
            setWithdrawTarget(null);
            onCycleAction?.("Exam cycle withdrawn", "warning");
          }}
        />
      )}
    </div>
  );
}
