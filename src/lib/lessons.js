import { api } from "./api";

// PUT /api/lessons/  (upsert)
export function upsertLesson(body) {
  return api("/api/lessons/", {
    method: "PUT",
    body,
  });
}

// GET /api/lessons/student/:studentId  — returns list; pick the latest
export async function getLatestLesson(studentId) {
  const data = await api(`/api/lessons/student/${studentId}`);
  const lessons = Array.isArray(data) ? data : data?.lessons ?? [];
  if (lessons.length === 0) return null;

  // Sort descending by lessonDate (or createdAt) and return the first
  lessons.sort(
    (a, b) =>
      new Date(b.lessonDate || b.createdAt) -
      new Date(a.lessonDate || a.createdAt),
  );
  return lessons[0];
}
