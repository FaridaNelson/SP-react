import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";

const DEFAULT_ITEMS = [
  { id: "scales", label: "Scales", weight: 15, score: 0 },
  { id: "pieceA", label: "Piece A", weight: 20, score: 0 },
  { id: "pieceB", label: "Piece B", weight: 20, score: 0 },
  { id: "pieceC", label: "Piece C", weight: 20, score: 0 },
  { id: "sightReading", label: "Sight Reading", weight: 13, score: 0 },
  { id: "auralTraining", label: "AuralTraining", weight: 12, score: 0 },
];

export function useProgress(studentId, { scope = "teacher" } = {}) {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [isLoading, setIsLoading] = useState(true);

  // NEW: history state
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const base =
    scope === "parent" ? "/api/parent/students" : "/api/teacher/students";

  // Load snapshot progress
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
        const data = await api(`${base}/${studentId}/progress`);
        if (!alive) return;
        setItems(data?.items?.length ? data.items : DEFAULT_ITEMS);
      } catch {
        if (alive) setItems(DEFAULT_ITEMS);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [studentId, base]);

  const saveScores = useCallback(
    async (nextItems) => {
      setItems(nextItems); // optimistic
      try {
        if (!studentId) return;
        await api(`${base}/${studentId}/progress`, {
          method: "POST",
          body: { items: nextItems },
        });
      } catch {
        // TODO: toast/rollback
      }
    },
    [studentId, base],
  );

  // NEW: fetch history on demand (button click)
  const fetchHistory = useCallback(async () => {
    if (!studentId) return;
    setHistoryLoading(true);
    try {
      const data = await api(`${base}/${studentId}/scores`);
      // accept either { items: [...] } or [...]
      setHistory(Array.isArray(data) ? data : (data?.items ?? []));
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [studentId, base]);

  // NEW: add entries from AddScoreModal (bulk)
  const addScoreEntries = useCallback(
    async (entries) => {
      if (!studentId) return;

      // optimistic prepend for immediate UI
      setHistory((prev) => [...entries, ...prev]);

      await api(`${base}/${studentId}/scores`, {
        method: "POST",
        body: { entries },
      });

      // refresh history after save (keeps server timestamps as truth)
      await fetchHistory();
    },
    [studentId, base, fetchHistory],
  );

  return {
    items,
    setItems,
    saveScores,
    isLoading,

    // NEW exports
    history,
    historyLoading,
    fetchHistory,
    addScoreEntries,
  };
}
