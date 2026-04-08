// TODO: backend endpoint GET /api/parent/students/:studentId/cycles
// required — see SP-express/CLAUDE.md for existing cycle route patterns
import { useState, useEffect } from "react";
import { ExamCycleCard } from "../../../components/ExamCycle/ExamCycleList";
import { useStudentLessons } from "../../../components/ExamCycle/examCycleUtils";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ExamsSection({ studentId }) {
  const { lessons: allLessons, loading: lessonsLoading } = useStudentLessons(studentId);
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setCycles([]);
      setLoading(false);
      return;
    }

    let alive = true;
    setLoading(true);
    setError(null);

    fetch(`${API}/api/parent/students/${studentId}/cycles`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!alive) return;
        setCycles(data.cycles ?? []);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [studentId]);

  if (loading || lessonsLoading) return <div className="pd-loading">Loading exam cycles…</div>;
  if (error) return <div className="pd-error">Failed to load exam cycles.</div>;
  if (cycles.length === 0)
    return <div className="pd-empty">No exam cycles found for this student.</div>;

  return (
    <div className="ecl">
      <div className="ecl__grid" role="list">
        {cycles.map((c) => (
          <ExamCycleCard
            key={c._id || c.id}
            cycle={c}
            studentId={studentId}
            allLessons={allLessons}
            readOnly
          />
        ))}
      </div>
    </div>
  );
}
