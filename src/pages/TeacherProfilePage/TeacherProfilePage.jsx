import { useMemo } from "react";
import { useProgress } from "../../hooks/useProgress";
import { computeReadiness } from "../../lib/progress";
import ProgressDonut from "../../components/ProgressDonut/ProgressDonut";
import AssignmentBreakdown from "../../components/AssignmentBreakdown/AssignmentBreakdown";
import "./TeacherProfilePage.css";

export default function TeacherProfilePage({ studentId }) {
  const { items, setItems, saveScores, isLoading } = useProgress(studentId);
  const readiness = useMemo(() => computeReadiness(items), [items]);

  const updateScore = (id, val) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, score: Math.max(0, Math.min(100, Number(val) || 0)) }
          : it
      )
    );

  if (isLoading)
    return (
      <main className="container">
        <p>Loading…</p>
      </main>
    );

  return (
    <main className="container teacher">
      <header className="teacher__head">
        <h1>Teacher Dashboard</h1>
        <p>
          Enter or adjust student scores. Changes save to the parent & student
          views.
        </p>
      </header>

      <section className="teacher__grid">
        <div className="teacher__card">
          <h2 className="teacher__h2">Scores</h2>
          <table className="teacher__table">
            <thead>
              <tr>
                <th>Element</th>
                <th>Weight</th>
                <th>Score (%)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.label}</td>
                  <td>{it.weight}%</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={it.score}
                      onChange={(e) => updateScore(it.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="teacher__actions">
            <button
              className="btn btn--primary"
              onClick={() => saveScores(items)}
            >
              Save
            </button>
          </div>
        </div>

        <div className="teacher__card">
          <ProgressDonut value={readiness} label="Readiness" />
        </div>

        <div className="teacher__card teacher__span">
          <h2 className="teacher__h2">By Assignment Element</h2>
          <AssignmentBreakdown items={items} />
        </div>
      </section>
    </main>
  );
}
