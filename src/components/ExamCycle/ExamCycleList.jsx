import { useEffect, useState } from "react";
import { listExamCycles } from "../../lib/examCycleApi";
import "./ExamCycleList.css";

const STATUS_META = {
  current: { label: "Current", className: "ecl__badge--current" },
  registered: { label: "Registered", className: "ecl__badge--registered" },
  completed: { label: "Completed", className: "ecl__badge--completed" },
  withdrawn: { label: "Withdrawn", className: "ecl__badge--withdrawn" },
};

export default function ExamCycleList({ studentId, onSelect, refreshKey, onCyclesLoaded }) {
  const [cycles, setCycles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className="ecl__error">
          Failed to load exam cycles.
        </div>
      </div>
    );
  }

  if (cycles.length === 0) {
    return (
      <div className="ecl">
        <div className="ecl__empty">No exam cycles yet.</div>
      </div>
    );
  }

  return (
    <div className="ecl">
      <ul className="ecl__list" role="list">
        {cycles.map((c) => {
          const id = c._id || c.id;
          const st = c.cycleStatus || c.status;
          const meta = STATUS_META[st] || STATUS_META.current;
          const progress = c.progressSummary;
          const pct =
            progress?.overallReadiness != null
              ? Math.round(progress.overallReadiness)
              : null;

          return (
            <li key={id} className="ecl__item">
              <button
                type="button"
                className="ecl__card"
                onClick={() => onSelect?.(c)}
              >
                <div className="ecl__cardTop">
                  <div className="ecl__info">
                    <span className="ecl__instrument">
                      {c.instrument || "Piano"}
                    </span>
                    <span className="ecl__type">
                      {c.examType || "Practical"}
                    </span>
                  </div>
                  <span className={`ecl__badge ${meta.className}`}>
                    {meta.label}
                  </span>
                </div>

                <div className="ecl__cardBody">
                  <div className="ecl__grade">
                    Grade{" "}
                    <span className="ecl__gradeNum">
                      {c.examGrade ?? "—"}
                    </span>
                  </div>

                  {pct != null && (
                    <div className="ecl__readiness">
                      <div className="ecl__readinessBar">
                        <div
                          className="ecl__readinessFill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="ecl__readinessPct">{pct}%</span>
                    </div>
                  )}
                </div>

                <div className="ecl__cardFooter">
                  {c.examDate && (
                    <div className="ecl__date">
                      Exam date:{" "}
                      {new Date(c.examDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  )}

                  {st === "completed" && (
                    <div className="ecl__result">
                      {c.examTaken != null && (
                        <span className="ecl__resultItem">
                          Taken:{" "}
                          {new Date(c.examTaken).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      {pct != null && (
                        <span className="ecl__resultItem">
                          Final: {pct}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
