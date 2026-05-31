import { api } from "./api";

/* ── enum mapping: UI labels → backend values ── */

const EXAM_TYPE_MAP = {
  "ABRSM - Performance": "Performance",
  "ABRSM - Practical": "Practical",
  Performance: "Performance",
  Practical: "Practical",
};

export async function parseExamResultPdf(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api("/api/exam-results/parse-pdf", {
    method: "POST",
    body: formData,
  });

  return res;
}

function normalizePayload(payload) {
  const out = { ...payload };

  if (out.examType) {
    out.examType = EXAM_TYPE_MAP[out.examType] || out.examType;
  }

  if (out.examGrade != null) {
    out.examGrade =
      typeof out.examGrade === "string"
        ? parseInt(out.examGrade, 10)
        : out.examGrade;
  }

  return out;
}

/* ── API calls ── */

export function createExamCycle(payload) {
  return api("/api/exam-cycles", {
    method: "POST",
    body: normalizePayload(payload),
  });
}

export function listExamCycles(studentId) {
  return api(`/api/exam-cycles/student/${studentId}`);
}

export function getExamCycle(cycleId) {
  return api(`/api/exam-cycles/${cycleId}`);
}

export function completeExamCycle(cycleId, payload) {
  return api(`/api/exam-cycles/${cycleId}/complete`, {
    method: "POST",
    body: payload,
  });
}

export function withdrawExamCycle(cycleId, payload) {
  return api(`/api/exam-cycles/${cycleId}/withdraw`, {
    method: "POST",
    body: payload,
  });
}

export function archiveExamCycle(cycleId) {
  return api(`/api/exam-cycles/${cycleId}`, {
    method: "DELETE",
  });
}
