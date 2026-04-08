import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "../../../lib/api";

export function useParentData() {
  const [students,        setStudents]        = useState([]);
  const [selectedId,      setSelectedId]      = useState(null);
  const [items,           setItems]           = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingItems,    setLoadingItems]    = useState(false);
  const [error,           setError]           = useState(null);

  // Fetch children list on mount
  useEffect(() => {
    setLoadingStudents(true);
    fetch(`${API_BASE}/api/parent/students`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then(({ students: list }) => {
        setStudents(list ?? []);
        if (list?.length) setSelectedId(list[0]._id);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingStudents(false));
  }, []);

  // Fetch progress whenever selected child changes
  useEffect(() => {
    if (!selectedId) return;
    setLoadingItems(true);
    setError(null);
    fetch(`${API_BASE}/api/parent/students/${selectedId}/progress`, {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then(({ items: list }) => setItems(list ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingItems(false));
  }, [selectedId]);

  const selectStudent = useCallback((id) => {
    setSelectedId(id);
    setItems([]);
  }, []);

  const selectedStudent = students.find((s) => s._id === selectedId) ?? null;
  const cycle           = selectedStudent?.activeExamCycleId ?? null;

  return {
    students,
    selectedId,
    selectedStudent,
    cycle,
    items,
    loadingStudents,
    loadingItems,
    error,
    selectStudent,
  };
}
