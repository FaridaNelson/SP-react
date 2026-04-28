import { api } from "./api";

// PUT /api/lessons/  (upsert)
export function upsertLesson(body) {
  return api("/api/lessons/", {
    method: "PUT",
    body,
  });
}

export async function getLatestLesson(
  studentId,
  { examPreparationCycleId, instrument } = {},
) {
  const params = new URLSearchParams();

  if (examPreparationCycleId) {
    params.set("examPreparationCycleId", examPreparationCycleId);
  }

  if (instrument) {
    params.set("instrument", instrument);
  }

  const query = params.toString();
  const url = `/api/lessons/student/${studentId}/latest${query ? `?${query}` : ""}`;

  const data = await api(url);
  return data?.lesson || null;
}

export function updateLesson(lessonId, body) {
  return api(`/api/lessons/${lessonId}`, {
    method: "PATCH",
    body,
  });
}
