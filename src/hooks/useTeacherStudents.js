import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { getTeacherStudentsFetchMode } from "./useTeacherStudentsState";

/**
 * Normalise a student record from the new API shape so the rest of the
 * UI can keep using `student.name`.
 *
 * The API returns { accessId, instrument, role, status, student: { … } }.
 * Flatten student fields to the top level and keep access-level fields.
 */
function normalizeStudent(item) {
  const s = item.student || item; // graceful fallback if already flat
  const composed = `${s.firstName || ""} ${s.lastName || ""}`.trim();
  const name = s.name || composed || "Unnamed";
  return {
    ...s,
    name,
    firstName: s.firstName || "",
    lastName: s.lastName || "",
    accessId: item.accessId,
    role: item.role,
    accessStatus: item.status, // avoid clash with student.status
    summary: item.summary ?? null,
  };
}

export function useTeacherStudents(teacherId) {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const loadedTeacherIdRef = useRef(null);

  useEffect(() => {
    if (!teacherId) {
      setStudents([]);
      setIsLoading(false);
      setIsRefreshing(false);
      loadedTeacherIdRef.current = null;
      return;
    }

    let alive = true;
    const fetchMode = getTeacherStudentsFetchMode({
      teacherId,
      loadedTeacherId: loadedTeacherIdRef.current,
    });

    (async () => {
      try {
        setIsLoading(fetchMode.isInitialLoad);
        setIsRefreshing(fetchMode.isBackgroundRefresh);
        const data = await api(
          `/api/teacher-student-access/teacher/${teacherId}/students`,
        );
        if (!alive) return;

        const raw = Array.isArray(data) ? data : data?.students ?? [];
        setStudents(raw.map(normalizeStudent));
        setError(null);
      } catch (e) {
        if (!alive) return;

        if (e?.status === 404) {
          setStudents([]);
          setError(null);
        } else {
          setError(e);
        }
      } finally {
        if (alive) {
          loadedTeacherIdRef.current = teacherId;
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [teacherId, refreshKey]);

  return {
    students,
    isLoading,
    isRefreshing,
    error,
    refresh: () => setRefreshKey((k) => k + 1),
  };
}
