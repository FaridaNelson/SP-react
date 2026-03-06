import { computePiecePercent, computeScalesPercent } from "./scoreMath";

/**
 * Convert latestLesson.pieces[] into the local draft shape:
 * { [pieceId]: { criteria: { [criterionId]: {score, note} } } }
 */
export function lessonPiecesToDraftMap(piecesArr = []) {
  const out = {};
  for (const p of piecesArr) {
    const criteria = {};
    for (const c of p.criteria || []) {
      criteria[c.criterionId] = {
        // preserve explicit 0..6 if stored; otherwise undefined
        score: Number.isFinite(c.score) ? c.score : undefined,
        note: c.note ?? "",
      };
    }
    out[p.pieceId] = { criteria };
  }
  return out;
}

/**
 * Convert latestLesson.scales.items[] into the local draft shape:
 * { [scaleId]: { ready, note } }
 */
export function lessonScalesToDraftMap(scales = {}) {
  const out = {};
  for (const it of scales.items || []) {
    out[it.scaleId] = { ready: it.ready === true, note: it.note ?? "" };
  }
  return out;
}

/**
 * Build a full "today" baseline from latestLesson.
 * Returns everything we need to create a full payload even if user only edits one piece.
 */
export function buildBaselineFromLatestLesson(latestLesson) {
  const baselinePieces = lessonPiecesToDraftMap(latestLesson?.pieces || []);
  const baselineScales = lessonScalesToDraftMap(latestLesson?.scales || {});
  const baselineSight = latestLesson?.sightReading ?? null;
  const baselineAural = latestLesson?.auralTraining ?? null;

  const baselineScalesPercent = Number.isFinite(latestLesson?.scales?.percent)
    ? latestLesson.scales.percent
    : computeScalesPercent(baselineScales);

  return {
    baselinePieces,
    baselineScales,
    baselineScalesPercent,
    baselineSight,
    baselineAural,
  };
}

/**
 * Merge one updated piece into baseline, then recompute all percents (consistent DB snapshot).
 */
export function mergeOnePieceAndRecompute({
  pieceId,
  piecesDraft, // current local draft state
  latestLesson,
  piecesDef, // PIECES config array (contains criteria weights)
}) {
  const {
    baselinePieces,
    baselineScales,
    baselineScalesPercent,
    baselineSight,
    baselineAural,
  } = buildBaselineFromLatestLesson(latestLesson);

  const mergedPieces = {
    ...baselinePieces,
    [pieceId]: piecesDraft?.[pieceId],
  };

  const mergedPiecePercents = {};
  for (const p of piecesDef) {
    mergedPiecePercents[p.id] = computePiecePercent(
      mergedPieces[p.id],
      p.criteria,
    );
  }

  return {
    mergedPieces,
    mergedPiecePercents,
    baselineScales,
    baselineScalesPercent,
    baselineSight,
    baselineAural,
  };
}
