import { useMemo } from "react";
import { useProgress } from "../../hooks/useProgress";
import { computeReadiness } from "../../lib/progress";
import ProgressDonut from "../../components/ProgressDonut/ProgressDonut";
import AssignmentBreakdown from "../../components/AssignmentBreakdown/AssignmentBreakdown";
import "./ParentProfilePage.css";

export default function ParentProfilePage({ studentId, user }) {
  if (!studentId) {
    return (
      <main className="container parent">
        <header className="parent__head">
          <h1>Student Progress</h1>
          <p>To view progress, link your student ID (ask your teacher).</p>
        </header>
      </main>
    );
  }

  const { items, isLoading } = useProgress(studentId, { scope: "parent" });
  const readiness = useMemo(() => computeReadiness(items), [items]);

  if (isLoading)
    return (
      <main className="container">
        <p>Loading…</p>
      </main>
    );

  return (
    <main className="container parent">
      <header className="parent__head">
        <h1>Student Progress</h1>
        <p>Exam readiness overview based on teacher-entered scores.</p>
      </header>

      <section className="parent__grid">
        <div className="parent__card">
          <ProgressDonut value={readiness} label="Readiness" />
        </div>

        <div className="parent__card">
          <h2 className="parent__h2">By Assignment Element</h2>
          <AssignmentBreakdown items={items} />
        </div>
      </section>
    </main>
  );
}
