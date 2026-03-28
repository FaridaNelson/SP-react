import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";

const DEFAULT_ITEMS = [
  { id: "scales", label: "Scales", weight: 14, score: 0 },
  { id: "pieceA", label: "Piece A", weight: 20, score: 0 },
  { id: "pieceB", label: "Piece B", weight: 20, score: 0 },
  { id: "pieceC", label: "Piece C", weight: 20, score: 0 },
  { id: "sightReading", label: "Sight Reading", weight: 14, score: 0 },
  { id: "auralTraining", label: "Aural Training", weight: 12, score: 0 },
];

export function useProgress(studentId, { scope = "teacher" } = {}) {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [isLoading, setIsLoading] = useState(true);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Progress snapshot — GET /api/students/:studentId (teacher)
  // or GET /api/parent/students/:id/progress (parent)
  useEffect(() => {
    let alive = true;

    if (!studentId) {
      setItems(DEFAULT_ITEMS);
      setIsLoading(false);
      return () => {
        alive = false;
      };
    }

    (async () => {
      try {
        setIsLoading(true);

        let data;
        if (scope === "parent") {
          data = await api(`/api/parent/students/${studentId}/progress`);
        } else {
          data = await api(`/api/students/${studentId}`);
        }

        if (!alive) return;

        const payload = scope === "parent" ? data : data?.student || data;

        const progressItems =
          payload?.progressSummary?.items || payload?.items || null;

        setItems(progressItems?.length ? progressItems : DEFAULT_ITEMS);
      } catch {
        if (alive) setItems(DEFAULT_ITEMS);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [studentId, scope]);

  // Save scores — POST /api/score-entries/
  const saveScores = useCallback(
    async (
      nextItems,
      { examPreparationCycleId, instrument, lessonDate } = {},
    ) => {
      setItems(nextItems); // optimistic
      try {
        if (!studentId) return;

        const promises = nextItems
          .filter((it) => it.score != null && it.score > 0)
          .map((it) =>
            api("/api/score-entries/", {
              method: "POST",
              body: {
                studentId,
                examPreparationCycleId,
                instrument,
                lessonDate: lessonDate || new Date().toISOString().slice(0, 10),
                elementId: it.id,
                score: it.score,
              },
            }),
          );
        await Promise.all(promises);
      } catch {
        // TODO: toast/rollback
      }
    },
    [studentId],
  );

  // Fetch score history — GET /api/score-entries/student/:studentId
  const fetchHistory = useCallback(async () => {
    if (!studentId) return;
    setHistoryLoading(true);
    try {
      const data = await api(`/api/score-entries/student/${studentId}`);
      setHistory(Array.isArray(data) ? data : (data?.items ?? []));
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [studentId]);

  // Add score entries (bulk) — POST /api/score-entries/
  const addScoreEntries = useCallback(
    async (entries) => {
      if (!studentId) return;

      // optimistic prepend for immediate UI
      setHistory((prev) => [...entries, ...prev]);

      const promises = entries.map((entry) =>
        api("/api/score-entries/", {
          method: "POST",
          body: {
            studentId,
            ...entry,
          },
        }),
      );
      await Promise.all(promises);

      // refresh history after save (keeps server timestamps as truth)
      await fetchHistory();
    },
    [studentId, fetchHistory],
  );

  return {
    items,
    setItems,
    saveScores,
    isLoading,

    history,
    historyLoading,
    fetchHistory,
    addScoreEntries,
  };
}
