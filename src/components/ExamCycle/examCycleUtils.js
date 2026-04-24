import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export function sortCycles(cycles = []) {
  const active = [];
  const closed = [];

  for (const c of cycles) {
    const st = c.cycleStatus || c.status;
    if (st === "current" || st === "registered") active.push(c);
    else closed.push(c);
  }

  closed.sort((a, b) => {
    const dateA = new Date(a.examTaken || a.updatedAt || 0);
    const dateB = new Date(b.examTaken || b.updatedAt || 0);
    return dateB - dateA;
  });

  return [...active, ...closed];
}

function dateKey(value) {
  return value ? String(value).slice(0, 10) : "";
}

function timeValue(value) {
  return value ? new Date(value).getTime() : 0;
}

export function sortLessonsOldestFirst(lessons = []) {
  return [...lessons].sort((a, b) => {
    const aDate = dateKey(a.lessonDate);
    const bDate = dateKey(b.lessonDate);

    if (aDate !== bDate) return aDate.localeCompare(bDate);

    return (
      timeValue(a.lessonStartAt || a.createdAt) -
      timeValue(b.lessonStartAt || b.createdAt)
    );
  });
}

export function sortLessonsNewestFirst(lessons = []) {
  return [...lessons].sort((a, b) => {
    const aDate = dateKey(a.lessonDate);
    const bDate = dateKey(b.lessonDate);

    if (aDate !== bDate) return bDate.localeCompare(aDate);

    return (
      timeValue(b.lessonStartAt || b.createdAt) -
      timeValue(a.lessonStartAt || a.createdAt)
    );
  });
}

export function buildLessonReadiness(lessons = []) {
  return sortLessonsOldestFirst(lessons)
    .filter(
      (lesson) =>
        lesson.lessonTotalScore !== null &&
        lesson.lessonTotalScore !== undefined,
    )
    .map((lesson, index) => ({
      date: dateKey(lesson.lessonDate) || "unknown",
      readiness: Math.round(Number(lesson.lessonTotalScore) || 0),
      lessonLabel: `L${index + 1}`,
      lesson,
    }));
}

export function useStudentLessons(studentId) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId) {
      setLessons([]);
      return;
    }

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
      .catch(() => {
        if (alive) setLessons([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [studentId]);

  return { lessons, loading };
}

export function filterLessonsForCycle(allLessons = [], cycleId) {
  const filtered = allLessons.filter(
    (lesson) =>
      String(
        lesson.examPreparationCycleId?._id || lesson.examPreparationCycleId,
      ) === String(cycleId),
  );

  return sortLessonsNewestFirst(filtered);
}
