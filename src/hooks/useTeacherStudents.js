import { useEffect, useState } from "react";
import { api } from "../lib/api";

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
  };
}

export function useTeacherStudents(teacherId) {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teacherId) {
      setStudents([]);
      setIsLoading(false);
      return;
    }

    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await api(
          `/api/teacher-student-access/teacher/${teacherId}/students`,
        );
        if (!alive) return;

        const raw = Array.isArray(data) ? data : data?.students ?? [];
        setStudents(raw.map(normalizeStudent));
        setError(null);
      } catch (e) {
        if (e?.status === 404) {
          setStudents([]);
          setError(null);
        } else {
          setError(e);
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [teacherId]);

  return { students, isLoading, error };
}
