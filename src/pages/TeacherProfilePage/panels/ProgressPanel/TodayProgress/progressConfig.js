export const BASE_CRITERIA = [
  { id: "pitch", label: "Pitch", weight: 0.2 },
  { id: "time", label: "Time", weight: 0.2 },
  { id: "tone", label: "Tone", weight: 0.2 },
  { id: "shape", label: "Shape", weight: 0.2 },
  { id: "performance", label: "Performance", weight: 0.2 },
];

export const PIECES = [
  { id: "pieceA", title: "Piece A", criteria: BASE_CRITERIA },
  { id: "pieceB", title: "Piece B", criteria: BASE_CRITERIA },
  { id: "pieceC", title: "Piece C", criteria: BASE_CRITERIA },
];

export const DEFAULT_SCALES = [
  { id: "c_major", label: "C Major" },
  { id: "g_major", label: "G Major" },
  { id: "d_major", label: "D Major" },
  { id: "f_major", label: "F Major" },
  { id: "a_minor_h", label: "A Minor Harmonic" },
  { id: "d_minor_h", label: "D Minor Harmonic" },
  { id: "c_major_contrary", label: "C Major Contrary" },
  { id: "g_major_arpeggio", label: "G Major Arpeggio" },
  { id: "a_minor_arpeggio", label: "A Minor Arpeggio" },
];
