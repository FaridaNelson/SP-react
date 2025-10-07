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
  const base =
    scope === "parent" ? "/api/parent/students" : "/api/teacher/students";

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
        // expect: { items: [{id,label,weight,score}] }
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
  }, [studentId]);

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
        // TODO: handle rollback or toast
      }
    },
    [studentId, base]
  );

  return { items, setItems, saveScores, isLoading };
}
