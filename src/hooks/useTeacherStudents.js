import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function useTeacherStudents() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // <-- was loading/setLeading
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await api("/api/teacher/students");
        if (!alive) return;

        // accept either an array or an object { students: [...] }
        setStudents(Array.isArray(data) ? data : data?.students ?? []);
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
  }, []);

  return { students, isLoading, error };
}
