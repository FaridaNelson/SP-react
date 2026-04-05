import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { computeReadiness } from "../../lib/progress";

/* ── Default weights for readiness calc ── */
export const DEFAULT_WEIGHTS = {
  scales: 14,
  pieceA: 20,
  pieceB: 20,
  pieceC: 20,
  sightReading: 14,
  auralTraining: 12,
};

/* ── Sort: active cycles first, then by closed date desc ── */
export function sortCycles(cycles) {
  const active = [];
  const closed = [];
  for (const c of cycles) {
    const st = c.cycleStatus || c.status;
    if (st === "current" || st === "registered") {
      active.push(c);
    } else {
      closed.push(c);
    }
  }
  closed.sort((a, b) => {
    const dateA = new Date(a.examTaken || a.updatedAt || 0);
    const dateB = new Date(b.examTaken || b.updatedAt || 0);
    return dateB - dateA;
  });
  return [...active, ...closed];
}

export function buildLessonReadiness(lessons) {
  if (!lessons || lessons.length === 0) return [];

  const sorted = [...lessons].sort(
    (a, b) => new Date(a.lessonDate) - new Date(b.lessonDate),
  );

  return sorted.reduce((acc, lesson) => {
    const pieceA = lesson.pieces?.find((p) => p.pieceId === "pieceA")?.percent ?? 0;
    const pieceB = lesson.pieces?.find((p) => p.pieceId === "pieceB")?.percent ?? 0;
    const pieceC = lesson.pieces?.find((p) => p.pieceId === "pieceC")?.percent ?? 0;
    const scales = lesson.scales?.percent ?? 0;
    const sightReading = lesson.sightReading?.score ?? 0;
    const auralTraining = lesson.auralTraining?.score ?? 0;

    const elements = [
      { key: "pieceA", score: pieceA },
      { key: "pieceB", score: pieceB },
      { key: "pieceC", score: pieceC },
      { key: "scales", score: scales },
      { key: "sightReading", score: sightReading },
      { key: "auralTraining", score: auralTraining },
    ];

    const items = elements
      .filter((e) => e.score > 0)
      .map((e) => ({ score: e.score, weight: DEFAULT_WEIGHTS[e.key] }));

    if (items.length === 0) return acc;

    const date = lesson.lessonDate?.slice(0, 10) || "unknown";
    acc.push({ date, readiness: computeReadiness(items) });
    return acc;
  }, []);
}

/* Fetch ALL lessons for a student once — used at list level */
export function useStudentLessons(studentId) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId) { setLessons([]); return; }
    let alive = true;
    setLoading(true);
    api(`/api/lessons/student/${studentId}`)
      .then((res) => {
        if (!alive) return;
        const all = Array.isArray(res)
          ? res
          : (res?.lessons ?? res?.items ?? []);
        setLessons(all);
      })
      .catch(() => { if (alive) setLessons([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [studentId]);

  return { lessons, loading };
}

export function filterLessonsForCycle(allLessons, cycleId) {
  const filtered = allLessons.filter(
    (l) => String(l.examPreparationCycleId?._id
                  || l.examPreparationCycleId)
           === String(cycleId)
  );
  return [...filtered].sort(
    (a, b) => new Date(b.lessonDate) - new Date(a.lessonDate)
  );
}
