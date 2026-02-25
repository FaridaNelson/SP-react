import { useEffect, useState } from "react";
import { getLatestLesson } from "../../../lib/lessons.js";
export function useLatestLesson(studentId, { enabled = true } = {}) {
  const [latestLesson, setLatestLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !studentId) {
      setLatestLesson(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let alive = true;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await getLatestLesson(studentId);
        if (!alive) return;
        setLatestLesson(data || null);
      } catch (e) {
        if (!alive) return;
        setLatestLesson(null);
        setError(e);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [studentId, enabled]);

  return { latestLesson, setLatestLesson, isLoading, error };
}
