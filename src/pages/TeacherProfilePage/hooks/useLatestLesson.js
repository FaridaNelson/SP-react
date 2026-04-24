import { useEffect, useState } from "react";
import { getLatestLesson } from "../../../lib/lessons.js";

export function useLatestLesson(
  studentId,
  { examPreparationCycleId, instrument, enabled = true } = {},
) {
  const [latestLesson, setLatestLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !studentId || !examPreparationCycleId || !instrument) {
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
        const data = await getLatestLesson(studentId, {
          examPreparationCycleId,
          instrument,
        });
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
  }, [studentId, examPreparationCycleId, instrument, enabled]);

  return { latestLesson, setLatestLesson, isLoading, error };
}
