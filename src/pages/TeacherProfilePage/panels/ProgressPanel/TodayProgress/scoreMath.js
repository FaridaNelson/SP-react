export function initPieces(PIECES) {
  const out = {};
  for (const p of PIECES) {
    out[p.id] = { criteria: {} };
    for (const c of p.criteria) {
      out[p.id].criteria[c.id] = { score: null, note: "" };
    }
  }
  return out;
}

export function initScales(list) {
  const out = {};
  for (const s of list) out[s.id] = { ready: false, note: "" };
  return out;
}

export const SCORE_TO_PCT = {
  0: 0,
  1: 33,
  2: 43,
  3: 57,
  4: 67,
  5: 80,
  6: 90,
};

export function scoreToPct(score) {
  if (!Number.isFinite(score)) return null;
  const s = Math.max(0, Math.min(6, Math.round(score)));
  return SCORE_TO_PCT[s] ?? null;
}

/**
 * pieceValue: { criteria: { [criterionId]: {score, note} } }
 * criteriaDef: [{id,label}...]
 * returns 0..100
 */

function safeWeight(w) {
  const n = Number(w);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function computePiecePercent(pieceValue, criteriaDef, opts = {}) {
  const { requireAll = false } = opts;
  const crit = Array.isArray(criteriaDef) ? criteriaDef : [];
  if (crit.length === 0) return 0;

  let weightedSum = 0; // sum of (criterionPct * weight)
  let wsum = 0; // sum of weights

  for (const c of crit) {
    const rawScore = pieceValue?.criteria?.[c.id]?.score;

    // if required, missing => invalid
    if (!Number.isFinite(rawScore)) {
      if (requireAll) return null;

      // if not required, treat missing as 0 BUT still count its weight
      const w = safeWeight(c.weight ?? 1);
      wsum += w;
      continue;
    }

    const pct = scoreToPct(rawScore) ?? 0; // uses 0..6 -> pct mapping
    const w = safeWeight(c.weight ?? 1);

    weightedSum += pct * w;
    wsum += w;
  }

  if (wsum === 0) return requireAll ? null : 0;
  return Math.round(weightedSum / wsum);
}

/** Returns an array of missing criterionIds for a given piece */
export function getMissingPieceCriteria(pieceValue, criteriaDef) {
  const crit = Array.isArray(criteriaDef) ? criteriaDef : [];
  const missing = [];

  for (const c of crit) {
    const score = pieceValue?.criteria?.[c.id]?.score;
    if (!Number.isFinite(score)) missing.push(c.id);
  }
  return missing;
}

export function computeScalesPercent(scalesMap) {
  const entries = Object.values(scalesMap || {});
  const answered = entries.filter((s) => s.ready === true || s.ready === false);
  if (answered.length === 0) return 0;
  const readyCount = answered.filter((s) => s.ready === true).length;
  return Math.round((readyCount / answered.length) * 100);
}

/**
 * Merge computed scores into existing progressItems array.
 * Keeps your current weights untouched.
 */
export function mergeIntoProgressItems(items, scores) {
  const next = Array.isArray(items) ? [...items] : [];
  const byId = new Map(next.map((it) => [it.id, it]));

  for (const [id, value] of Object.entries(scores)) {
    if (value == null) continue;
    const existing = byId.get(id);
    if (existing) existing.score = value;
    else next.push({ id, label: id, weight: 0, score: value });
  }
  return next;
}

export function buildLessonPayload({
  lessonDate,
  lessonStartTime,
  lessonEndTime,
  studentId,
  examPreparationCycleId,
  instrument,
  pieces,
  piecePercents,
  scales,
  scalesPercent,
  sight,
  aural,
  teacherNarrative,
  share,
}) {
  function combineDateAndTime(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null;

    const [y, m, d] = String(dateStr).split("-").map(Number);
    const [hh, mm] = String(timeStr).split(":").map(Number);

    if (!y || !m || !d || !Number.isFinite(hh) || !Number.isFinite(mm)) {
      return null;
    }

    return new Date(y, m - 1, d, hh, mm, 0).toISOString();
  }

  const lessonStartAt = combineDateAndTime(lessonDate, lessonStartTime);
  const lessonEndAt = combineDateAndTime(lessonDate, lessonEndTime);

  return {
    lessonDate,
    lessonStartAt,
    lessonEndAt,
    studentId,
    examPreparationCycleId,
    instrument,
    share,
    pieces: Object.entries(pieces || {}).map(([pieceId, pv]) => ({
      pieceId,
      percent: piecePercents?.[pieceId] ?? 0,
      criteria: Object.entries(pv?.criteria || {})
        .filter(
          ([, cv]) =>
            Number.isFinite(cv?.score) || (cv?.note && cv.note.trim()),
        )
        .map(([criterionId, cv]) => ({
          criterionId,
          score: Number.isFinite(cv?.score) ? cv.score : null,
          note: cv?.note?.trim() || null,
        })),
    })),
    scales: {
      percent: scalesPercent ?? 0,
      items: Object.entries(scales || {})
        .filter(([, sv]) => sv?.ready === true || sv?.ready === false)
        .map(([scaleId, sv]) => ({
          scaleId,
          ready: sv?.ready === true,
          note: sv?.note?.trim() || null,
        })),
    },
    sightReading: normalizeNoteBlock(sight),
    auralTraining: normalizeNoteBlock(aural),
    teacherNarrative: teacherNarrative?.trim() || null,
  };
}

export function normalizeNoteBlock(obj) {
  if (!obj) return null;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === "score") out.score = Number.isFinite(v) ? v : null;
    else out[k] = typeof v === "string" && v.trim() ? v.trim() : null;
  }
  return out;
}

export function formatLocal(yyyyMmDd) {
  const [y, m, d] = String(yyyyMmDd).split("-").map(Number);
  if (!y || !m || !d) return String(yyyyMmDd);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(y, m - 1, d));
}
