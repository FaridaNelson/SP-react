export const CURRENT_ASSIGNMENT = [
  { key: "scales", title: "Scales" },
  { key: "piece-a", title: "Piece A" },
  { key: "piece-b", title: "Piece B" },
  { key: "piece-c", title: "Piece C" },
  {
    key: "sight-reading",
    title: "Daily Sight-Reading",
    type: "soundslice",
    sliceId: "r7RTc", // your live slice
    useApi: false, // use direct embed (you can flip to true later)
    meta: {
      title: "Slice Title",
      artist: "ABRSM",
      description: "ABRSM Piano Sight Reading",
    },
  },
  { key: "aural-training", title: "AuralTraining" },
];

export const HISTORY = [
  { key: "repertoire", title: "Repertoire List" },
  { key: "performances", title: "Past Performances" },
  { key: "competitions", title: "Competitions" },
  { key: "exams", title: "Examinations" },
];

export const TOOLS = [
  { key: "timer", title: "Timer" },
  { key: "metronome", title: "Metronome" },
  { key: "calendar", title: "Calendar" },
];
