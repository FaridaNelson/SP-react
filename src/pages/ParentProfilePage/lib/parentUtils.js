export const PASS_MARK = 67;

export const ELEMENT_META = {
  pieceA: { label: "Piece A", weight: 20 },
  pieceB: { label: "Piece B", weight: 20 },
  pieceC: { label: "Piece C", weight: 20 },
  pieceD: { label: "Piece D", weight: 20 },
  scales: { label: "Technique & Scales", weight: 14 },
  sightReading: { label: "Sight-Reading", weight: 14 },
  auralTraining: { label: "Aural", weight: 12 },
};

export const PERF_ELEMENTS = ["pieceA", "pieceB", "pieceC", "pieceD"];
export const GRADE_ELEMENTS = [
  "pieceA",
  "pieceB",
  "pieceC",
  "scales",
  "sightReading",
  "auralTraining",
];

export function requiredElementsFor(examType) {
  return examType === "Performance" ? PERF_ELEMENTS : GRADE_ELEMENTS;
}

export function computeReadiness(items = []) {
  let weighted = 0;
  let totalW = 0;
  items.forEach((item) => {
    const meta = ELEMENT_META[item.id];
    if (!meta) return;
    const score = typeof item.score === "number" ? item.score : 0;
    weighted += score * meta.weight;
    totalW += meta.weight;
  });
  return totalW > 0 ? Math.round(weighted / totalW) : 0;
}

export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function getDaysToExam(endDate) {
  if (!endDate) return null;
  const diff = Math.ceil((new Date(endDate) - new Date()) / 86400000);
  return diff > 0 ? diff : 0;
}

export function formatExamDate(endDate) {
  if (!endDate) return "";
  return new Date(endDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
