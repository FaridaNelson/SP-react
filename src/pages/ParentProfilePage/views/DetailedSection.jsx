import { useState, useEffect } from "react";
import LessonCard from "../../../components/LessonCard/LessonCard";
import { API_BASE } from "../../../lib/api";

export default function DetailedSection({ studentId, cycle }) {
  console.log("[DetailedSection] studentId:", studentId, "cycle:", cycle);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setLesson(null);
      setLoading(false);
      return;
    }

    let alive = true;
    setLoading(true);
    setError(null);

    let url = `${API_BASE}/api/lessons/student/${studentId}?limit=1`;
    if (cycle?._id) url += `&cycleId=${cycle._id}`;

    fetch(url, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!alive) return;
        const list = Array.isArray(data) ? data : (data.lessons ?? []);
        setLesson(list[0] ?? null);
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
  }, [studentId, cycle?._id]);

  if (loading) return <div className="pd-loading">Loading latest lesson…</div>;
  if (error) return <div className="pd-error">Could not load lesson.</div>;
  if (!lesson) return <div className="pd-empty">No lessons recorded yet.</div>;

  return <LessonCard lesson={lesson} readOnly />;
}
