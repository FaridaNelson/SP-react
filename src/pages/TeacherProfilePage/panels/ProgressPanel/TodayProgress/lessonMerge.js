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
