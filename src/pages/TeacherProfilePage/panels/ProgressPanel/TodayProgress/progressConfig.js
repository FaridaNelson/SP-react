export const BASE_CRITERIA = [
  { id: "pitch", label: "Pitch", weight: 0.2 },
  { id: "time", label: "Time", weight: 0.2 },
  { id: "tone", label: "Tone", weight: 0.2 },
  { id: "shape", label: "Shape", weight: 0.2 },
  { id: "performance", label: "Performance", weight: 0.2 },
];

export const ALL_PIECES = [
  { id: "pieceA", title: "Piece A", criteria: BASE_CRITERIA },
  { id: "pieceB", title: "Piece B", criteria: BASE_CRITERIA },
  { id: "pieceC", title: "Piece C", criteria: BASE_CRITERIA },
  { id: "pieceD", title: "Piece D", criteria: BASE_CRITERIA },
];

// Default export for backward compat (3 pieces for Practical)
export const PIECES = ALL_PIECES.slice(0, 3);
