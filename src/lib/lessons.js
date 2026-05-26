import { api } from "./api";

// POST /api/lessons/ create new lesson
export function createLesson(body) {
  return api("/api/lessons/", {
    method: "POST",
    body,
  });
}

// PUT /api/lessons/  (upsert existing lesson by date)
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
