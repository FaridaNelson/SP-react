import { useEffect, useMemo, useState } from "react";
import { ALL_PIECES, PIECES } from "./TodayProgress/progressConfig";
import { mergeOnePieceAndRecompute } from "./TodayProgress/lessonMerge";
import "./ProgressPanel.css";
import { getMissingPieceCriteria } from "./TodayProgress/scoreMath";
import PieceCard from "./PieceCard";
import { getScalesForGrade } from "./TodayProgress/scaleCurriculum";
import {
  buildLessonPayload,
  computePiecePercent,
  computeScalesPercent,
  formatLocal,
  initPieces,
  initScales,
  mergeIntoProgressItems,
} from "./TodayProgress/scoreMath";
import ScalesCard from "./ScalesCard";
import SightreadingCard from "./SightreadingCard";
import AuralCard from "./AuralCard";
import { upsertLesson, getLatestLesson } from "../../../../lib/lessons";

export default function ProgressPanel({
  open,
  onClose,
  student,
  items = [],
  onSaveScores,
  onLessonSaved,
  activeCycle,
}) {
  const [lessonDate, setLessonDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const studentId = student?._id || student?.id;
  const [latestLesson, setLatestLesson] = useState(null);
  const [pieceErrors, setPieceErrors] = useState({});
  // { [pieceId]: string[] missingCriterionIds } - used to show validation errors if user tries to save without filling all criteria scores

  // Determine which elements to show based on active cycle's examType
  const isPerformance = activeCycle?.examType === "Performance";
  const requiredElements = activeCycle?.progressSummary?.requiredElements || [];

  // Build piece list: 4 pieces for Performance, 3 for Practical
  // Overlay piece names from the cycle if available
  const cyclePieces = activeCycle?.pieces || [];
  const activePieces = useMemo(() => {
    const base = isPerformance ? ALL_PIECES : PIECES;
    // Only show pieces that are in requiredElements (if available)
    const filtered = requiredElements.length > 0
      ? base.filter((p) => requiredElements.includes(p.id))
      : base;
    return filtered.map((p) => {
      const match = cyclePieces.find((cp) => cp.key === p.id || cp.label === p.title);
      const pieceName = match?.title || "";
      return {
        ...p,
        title: pieceName ? `${p.title}: ${pieceName}` : p.title,
      };
    });
  }, [isPerformance, requiredElements, cyclePieces]);

  const showScales = !isPerformance && (requiredElements.length === 0 || requiredElements.includes("scales"));
  const showSightReading = !isPerformance && (requiredElements.length === 0 || requiredElements.includes("sightReading"));
  const showAural = !isPerformance && (requiredElements.length === 0 || requiredElements.includes("auralTraining"));

  // Scales curriculum for this student (used to show scale names and which scales are relevant for this student's grade level)
  const gradeScales = useMemo(() => {
    return getScalesForGrade(student?.grade);
  }, [student?.grade]);
  // -------- local state (draft preserved if user closes without saving) --------
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  // pieces state: { pieceId: { criteria: {criterionId: {score, note}}, overallNote } }
  const [pieces, setPieces] = useState(() => initPieces(PIECES));
  // scales state: { scaleId: { ready: true|false|null, note } }
  const [scales, setScales] = useState(() => initScales(gradeScales));
  // sight/aural: keep what you already implemented in AddScoreModal (notes)
  const [sight, setSight] = useState(() => ({
    score: undefined,
    pitchAccuracy: "",
    rhythmAccuracy: "",
    adequateTempo: "",
    confidentPresentation: "",
  }));
  const [aural, setAural] = useState(() => ({
    score: undefined,
    rhythmAccuracy: "",
    singingInPitch: "",
    musicalMemory: "",
    musicalPerceptiveness: "",
  }));

  const resetForm = () => {
    setPieces(initPieces(PIECES));
    setScales(initScales(gradeScales));
    setSight({
      score: undefined,
      pitchAccuracy: "",
      rhythmAccuracy: "",
      adequateTempo: "",
      confidentPresentation: "",
    });
    setAural({
      score: undefined,
      rhythmAccuracy: "",
      singingInPitch: "",
      musicalMemory: "",
      musicalPerceptiveness: "",
    });
    setTeacherNarrative("");
    setErr("");
  };

  const draftKey = `studiopulse:draft:${student?._id || student?.id}:${lessonDate}`;
  const [teacherNarrative, setTeacherNarrative] = useState("");

  // Reset panel ONLY when it opens fresh (optional)
  // If you want "draft persists even after closing", remove this effect.
  useEffect(() => {
    if (!open) return;
    setErr("");
    // comment these out if you want to persist draft across openings too
    // setPieces(initPieces(PIECES));
    // setScales(initScales(DEFAULT_SCALES));
    // setSight({ score: undefined, pitchAccuracy: "", rhythmAccuracy: "", adequateTempo: "", confidentPresentation: "" });
    // setAural({ score: undefined, rhythmAccuracy: "", singingInPitch: "", musicalMemory: "", musicalPerceptiveness: "" });
    // setTeacherNarrative("");
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const raw = localStorage.getItem(draftKey);
    if (!raw) return;

    try {
      const d = JSON.parse(raw);
      if (d?.pieces) setPieces(d.pieces);
      if (d?.scales) setScales(d.scales);
      if (d?.sight) setSight(d.sight);
      if (d?.aural) setAural(d.aural);
      if (typeof d?.teacherNarrative === "string")
        setTeacherNarrative(d.teacherNarrative);
    } catch {
      // ignore bad drafts
    }
  }, [open, draftKey]);

  useEffect(() => {
    if (!open) return;
    if (!studentId) return;

    (async () => {
      try {
        const latest = await getLatestLesson(studentId);
        setLatestLesson(latest);
      } catch (e) {
        console.warn("Failed to load latest lesson:", e);
        setLatestLesson(null);
      }
    })();
  }, [open, studentId]);

  useEffect(() => {
    if (!open) return;
    setScales(initScales(gradeScales));
  }, [open, gradeScales]);

  useEffect(() => {
    if (!open) return;

    const draft = {
      lessonDate,
      pieces,
      scales,
      sight,
      aural,
      teacherNarrative,
    };

    localStorage.setItem(draftKey, JSON.stringify(draft));
  }, [pieces, scales, sight, aural, teacherNarrative, lessonDate, open]);

  // --- computed piece percent scores (0..100) based on criteria 0..6 ---
  const piecePercents = useMemo(() => {
    const out = {};
    for (const p of activePieces) {
      out[p.id] = computePiecePercent(pieces?.[p.id], p.criteria);
    }
    return out;
  }, [pieces, activePieces]);

  // --- computed overall “scales percent” (0..100) ---
  const scalesPercent = useMemo(() => computeScalesPercent(scales), [scales]);

  // --- used to show student header ---
  const studentName = student?.name || "Student";

  async function handleSavePiece(pieceId, { share = false } = {}) {
    setErr("");

    const todayStr = new Date().toISOString().slice(0, 10);
    if (lessonDate > todayStr) {
      setErr("Date cannot be in the future");
      return;
    }

    const pieceDef = activePieces.find((p) => p.id === pieceId);
    if (!pieceDef) {
      setErr("Unknown piece");
      return;
    }

    // Validate only this piece (must have all criteria scored)
    const missing = getMissingPieceCriteria(
      pieces?.[pieceId],
      pieceDef.criteria,
    );

    // Only this piece should show validation errors, not the whole form
    if (missing.length) {
      setPieceErrors({ [pieceId]: missing });
      setErr("");
      return;
    }

    // Clear errors for this piece if validation passed
    setPieceErrors({});

    try {
      setBusy(true);

      // ✅ merge latest lesson + this edited piece, recompute all percents
      const {
        mergedPieces,
        mergedPiecePercents,
        baselineScales,
        baselineScalesPercent,
        baselineSight,
        baselineAural,
      } = mergeOnePieceAndRecompute({
        pieceId,
        piecesDraft: pieces,
        latestLesson,
        piecesDef: activePieces,
      });

      // Update progress snapshot (Phase 1)
      const nextItems = mergeIntoProgressItems(items, {
        pieceA: mergedPiecePercents.pieceA,
        pieceB: mergedPiecePercents.pieceB,
        pieceC: mergedPiecePercents.pieceC,
        scales: baselineScalesPercent,
        sightReading: baselineSight?.score ?? null,
        auralTraining: baselineAural?.score ?? null,
      });

      if (onSaveScores) await onSaveScores(nextItems);

      // Save a FULL lesson snapshot (Phase 2) so backend upsert doesn't wipe other fields
      const lessonPayload = buildLessonPayload({
        lessonDate,
        studentId,
        pieces: mergedPieces,
        piecePercents: mergedPiecePercents,
        scales: baselineScales,
        scalesPercent: baselineScalesPercent,
        sight: baselineSight,
        aural: baselineAural,
        teacherNarrative, // keep current text
        share,
      });

      const savedLesson = await upsertLesson(lessonPayload);

      setLatestLesson(savedLesson);
      onLessonSaved?.(savedLesson);
      setErr("");
    } catch (e) {
      setErr(e?.message || "Failed to save this piece");
    } finally {
      setBusy(false);
    }
  }
  async function handleSave({ share = false } = {}) {
    setErr("");
    // Phase 1: just update the existing progress snapshot with new scores (no lesson creation yet)

    const todayStr = new Date().toISOString().slice(0, 10);
    if (lessonDate > todayStr) {
      setErr("Date cannot be in the future");
      return;
    }

    // REQUIRED: all criteria for each piece must be filled
    const nextErrors = {};
    for (const p of activePieces) {
      const missing = getMissingPieceCriteria(pieces?.[p.id], p.criteria);
      if (missing.length) nextErrors[p.id] = missing;
    }

    if (Object.keys(nextErrors).length) {
      setPieceErrors(nextErrors);
      setErr(
        "Kind reminder: please fill out all piece criteria before saving.",
      );
      return;
    } else {
      setPieceErrors({});
    }

    try {
      setBusy(true);

      // 1) Update your EXISTING progress snapshot items (Phase 1)
      const scoreMap = {
        pieceA: piecePercents.pieceA,
        pieceB: piecePercents.pieceB,
        pieceC: piecePercents.pieceC,
      };
      if (isPerformance) {
        scoreMap.pieceD = piecePercents.pieceD;
      }
      if (showScales) scoreMap.scales = scalesPercent;
      if (showSightReading) scoreMap.sightReading = sight.score ?? null;
      if (showAural) scoreMap.auralTraining = aural.score ?? null;
      const nextItems = mergeIntoProgressItems(items, scoreMap);

      if (onSaveScores) {
        await onSaveScores(nextItems);
      }

      // 2) Also save a full lesson payload (Phase 2)

      const lessonPayload = buildLessonPayload({
        lessonDate,
        studentId,
        pieces,
        piecePercents,
        scales,
        scalesPercent,
        sight,
        aural,
        teacherNarrative,
        share,
      });
      const savedLesson = await upsertLesson(lessonPayload);
      console.log("SAVED LESSON:", savedLesson);

      // update the "Last class" UI immediately
      setLatestLesson(savedLesson);
      onLessonSaved?.(savedLesson);
      localStorage.removeItem(draftKey); // clear draft on successful save
      resetForm();
      onClose?.();
    } catch (e) {
      setErr(e?.message || "Failed to save progress");
    } finally {
      setBusy(false);
    }
  }

  function piecesArrayToMap(piecesArr = []) {
    const out = {};
    for (const p of piecesArr) {
      const criteria = {};
      for (const c of p.criteria || []) {
        criteria[c.criterionId] = {
          score: c.score ?? undefined,
          note: c.note ?? "",
        };
      }
      out[p.pieceId] = { criteria };
    }
    return out;
  }

  function scalesItemsToMap(scales = {}) {
    const out = {};
    for (const it of scales.items || []) {
      const ready = it?.ready === true; // null/undefined => false (Not Ready)
      out[it.scaleId] = { ready, note: it?.note ?? "" };
    }
    return out;
  }

  function piecePercentFromLesson(lesson, pieceId) {
    const p = (lesson?.pieces || []).find((x) => x.pieceId === pieceId);
    return Number.isFinite(p?.percent) ? p.percent : 0;
  }

  const lastPiecesMap = useMemo(
    () => piecesArrayToMap(latestLesson?.pieces || []),
    [latestLesson],
  );

  const lastScalesMap = useMemo(
    () => scalesItemsToMap(latestLesson?.scales || {}),
    [latestLesson],
  );

  const lastScalesPercent = Number.isFinite(latestLesson?.scales?.percent)
    ? latestLesson.scales.percent
    : 0;

  const lastSight = latestLesson?.sightReading || {};
  const lastAural = latestLesson?.auralTraining || {};

  if (!open) return null;

  return (
    <div className="pp__overlay" role="dialog" aria-modal="true">
      <div className="pp__panel">
        <header className="pp__head">
          <div>
            <div className="pp__kicker">
              Today’s Progress — <h2 className="pp__title">{studentName}</h2>
            </div>

            <div className="pp__dateWrap">
              <label htmlFor="lesson-date" className="pp__dateLabel">
                Lesson date:
              </label>
              <div className="pp__dateRow">
                <input
                  id="lesson-date"
                  name="lessonDate"
                  type="date"
                  className="pp__dateInput"
                  value={lessonDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setLessonDate(e.target.value)}
                  disabled={busy}
                />
                <div className="pp__dateDisplay">{formatLocal(lessonDate)}</div>
              </div>
            </div>
          </div>

          <button
            className="pp__close"
            type="button"
            onClick={onClose}
            disabled={busy}
          >
            ✕
          </button>
        </header>

        <div className="pp__body">
          {/* Pieces */}
          <section className="pp__section">
            <h3 className="pp__h3">Pieces</h3>

            {activePieces.map((p) => (
              <PieceCard
                idPrefix={`piece-${p.id}`} // for accessibility; optional but better
                key={p.id}
                piece={p}
                value={pieces[p.id]}
                last={lastPiecesMap[p.id] || { criteria: {} }}
                percent={piecePercents[p.id]}
                missingCriteria={pieceErrors[p.id] || []}
                onFocusCriterion={() =>
                  setPieceErrors((prev) => ({ ...prev, [p.id]: [] }))
                } // clear errors for this piece when user focuses any criterion
                onSavePiece={() => handleSavePiece(p.id, { share: true })}
                lastWeekPercent={piecePercentFromLesson(latestLesson, p.id)}
                disabled={busy}
                onSetScore={(criterionId, score) =>
                  setPieces((prev) => ({
                    ...prev,
                    [p.id]: {
                      ...prev[p.id],
                      criteria: {
                        ...prev[p.id].criteria,
                        [criterionId]: {
                          ...(prev[p.id].criteria?.[criterionId] || {}),
                          score,
                        },
                      },
                    },
                  }))
                }
                onSetNote={(criterionId, note) =>
                  setPieces((prev) => ({
                    ...prev,
                    [p.id]: {
                      ...prev[p.id],
                      criteria: {
                        ...prev[p.id].criteria,
                        [criterionId]: {
                          ...(prev[p.id].criteria?.[criterionId] || {}),
                          note,
                        },
                      },
                    },
                  }))
                }
              />
            ))}
          </section>

          {/* Scales — Practical only */}
          {showScales && (
            <section className="pp__section">
              <h3 className="pp__h3">Scales</h3>

              <ScalesCard
                title="Scales"
                scalesDef={gradeScales}
                value={scales}
                last={lastScalesMap}
                percent={scalesPercent}
                lastWeekPercent={lastScalesPercent}
                disabled={busy}
                onSetReady={(scaleId, isReady) =>
                  setScales((prev) => ({
                    ...prev,
                    [scaleId]: { ...(prev[scaleId] || {}), ready: isReady },
                  }))
                }
                onSetNote={(scaleId, note) =>
                  setScales((prev) => ({
                    ...prev,
                    [scaleId]: { ...(prev[scaleId] || {}), note },
                  }))
                }
              />
            </section>
          )}

          {showSightReading && (
            <SightreadingCard
              idPrefix={`sight-${studentId}-${lessonDate}`}
              value={sight}
              last={lastSight}
              disabled={busy}
              onChange={(k, v) => setSight((prev) => ({ ...prev, [k]: v }))}
            />
          )}

          {showAural && (
            <AuralCard
              idPrefix={`aural-${studentId}-${lessonDate}`}
              value={aural}
              last={lastAural}
              disabled={busy}
              onChange={(k, v) => setAural((prev) => ({ ...prev, [k]: v }))}
            />
          )}

          {/* Teacher narrative */}
          <section className="pp__section">
            <h3 className="pp__h3">Teacher Notes</h3>
            <textarea
              className="pp__textarea"
              rows={4}
              placeholder="Write a short summary for parents (optional)…"
              value={teacherNarrative}
              onChange={(e) => setTeacherNarrative(e.target.value)}
              disabled={busy}
            />
          </section>

          {err && <p className="pp__error">{err}</p>}
        </div>

        <footer className="pp__foot">
          <button
            type="button"
            className="pp__btn"
            onClick={() => {
              resetForm();
              localStorage.removeItem(draftKey); // optional: cancel clears draft too
              onClose?.();
            }}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="pp__btn"
            onClick={() => {
              const draft = {
                lessonDate,
                pieces,
                scales,
                sight,
                aural,
                teacherNarrative,
              };
              localStorage.setItem(draftKey, JSON.stringify(draft));
              onClose?.();
            }}
            disabled={busy}
          >
            {busy ? "Saving…" : "Save Draft"}
          </button>
          <button
            type="button"
            className="pp__btn pp__btn--primary"
            onClick={() => handleSave({ share: true })}
            disabled={busy}
          >
            {busy ? "Saving…" : "Save & Share"}
          </button>
        </footer>
      </div>

      {/* Basic styles so you can see it immediately; move to CSS file later */}
    </div>
  );
}
