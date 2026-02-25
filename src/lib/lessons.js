import { api } from "./api";

// POST /api/lessons  (upsert)
export function upsertLesson(body) {
  return api("/api/lessons", {
    method: "POST",
    body,
    auth: true,
  });
}

// GET /api/lessons/latest/:studentId
export function getLatestLesson(studentId) {
  return api(`/api/lessons/latest/${studentId}`, {
    method: "GET",
    auth: true,
  });
}
