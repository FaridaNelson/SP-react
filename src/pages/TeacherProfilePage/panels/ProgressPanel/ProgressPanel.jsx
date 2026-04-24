import { useEffect, useMemo, useState } from "react";
import { ALL_PIECES, PIECES } from "./TodayProgress/progressConfig";
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
import {
  upsertLesson,
  getLatestLesson,
  updateLesson,
} from "../../../../lib/lessons";
import {
  lessonPiecesToDraftMap,
  lessonScalesToDraftMap,
} from "./TodayProgress/lessonMerge";

function isPieceTouched(pieceValue) {
  if (!pieceValue?.criteria) return false;
  return Object.values(pieceValue.criteria).some((c) =>
    Number.isFinite(c?.score),
  );
}

function isScalesTouched(scalesMap) {
  if (!scalesMap) return false;
  return Object.values(scalesMap).some((s) => s?.ready === true);
}

function isSightAuralTouched(val) {
  return val?.score !== undefined && val?.score !== null && val?.score !== "";
}

const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, i) => {
  const hours = Math.floor(i / 4);
  const minutes = (i % 4) * 15;

  const value = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  const label = new Date(2000, 0, 1, hours, minutes).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  );

  return { value, label };
});

export default function ProgressPanel({
  open,
  onClose,
  editLesson = null,
  student,
  items = [],
  onSaveScores,
  onLessonSaved,
  activeCycle,
}) {
  const isEditing = !!editLesson?._id;

  const [lessonDate, setLessonDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [lessonStartTime, setLessonStartTime] = useState("");
  const [lessonEndTime, setLessonEndTime] = useState("");
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
    const filtered =
      requiredElements.length > 0
        ? base.filter((p) => requiredElements.includes(p.id))
        : base;
    return filtered.map((p) => {
      const match = cyclePieces.find(
        (cp) => cp.key === p.id || cp.label === p.title,
      );
      const pieceName = match?.title || "";
      return {
        ...p,
        title: pieceName ? `${p.title}: ${pieceName}` : p.title,
      };
    });
  }, [isPerformance, requiredElements, cyclePieces]);

  const showScales =
    !isPerformance &&
    (requiredElements.length === 0 || requiredElements.includes("scales"));
  const showSightReading =
    !isPerformance &&
    (requiredElements.length === 0 ||
      requiredElements.includes("sightReading"));
  const showAural =
    !isPerformance &&
    (requiredElements.length === 0 ||
      requiredElements.includes("auralTraining"));

  // Scales curriculum for this student (used to show scale names and which scales are relevant for this student's grade level)
  const gradeScales = useMemo(() => {
    return getScalesForGrade(student?.grade);
  }, [student?.grade]);
  // -------- local state (draft preserved if user closes without saving) --------
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  // pieces state: { pieceId: { criteria: {criterionId: {score, note}}, overallNote } }
  const [pieces, setPieces] = useState(() => initPieces(activePieces));
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
    setPieces(initPieces(activePieces));
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
    setLessonStartTime("");
    setLessonEndTime("");
    setErr("");
  };

  const draftKey = `studiopulse:draft:${student?._id || student?.id}:${lessonDate}`;
  const [teacherNarrative, setTeacherNarrative] = useState("");

  useEffect(() => {
    if (!open || !isEditing) return;

    setLessonDate(String(editLesson.lessonDate || "").slice(0, 10));

    if (editLesson.lessonStartAt) {
      const start = new Date(editLesson.lessonStartAt);
      setLessonStartTime(
        `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`,
      );
    }

    if (editLesson.lessonEndAt) {
      const end = new Date(editLesson.lessonEndAt);
      setLessonEndTime(
        `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`,
      );
    }

    setPieces({
      ...initPieces(activePieces),
      ...lessonPiecesToDraftMap(editLesson.pieces || []),
    });

    setScales({
      ...initScales(gradeScales),
      ...lessonScalesToDraftMap(editLesson.scales || {}),
    });

    setSight(editLesson.sightReading || {});
    setAural(editLesson.auralTraining || {});
    setTeacherNarrative(editLesson.teacherNarrative || "");
    setErr("");
  }, [open, isEditing, editLesson, activePieces, gradeScales]);
  // Reset panel ONLY when it opens fresh (optional)
  // If you want "draft persists even after closing", remove this effect.
  useEffect(() => {
    if (!open || isEditing) return;
    setPieces((prev) => {
      const next = initPieces(activePieces);

      for (const p of activePieces) {
        if (prev?.[p.id]?.criteria) {
          next[p.id] = prev[p.id];
        }
      }

      return next;
    });
  }, [open, isEditing, activePieces]);

  useEffect(() => {
    if (!open || isEditing) return;

    const raw = localStorage.getItem(draftKey);
    if (!raw) return;

    try {
      const d = JSON.parse(raw);
      if (d?.pieces) setPieces(d.pieces);
      if (d?.scales) setScales(d.scales);
      if (d?.sight) setSight(d.sight);
      if (d?.aural) setAural(d.aural);
      if (typeof d?.teacherNarrative === "string") {
        setTeacherNarrative(d.teacherNarrative);
      }
      if (typeof d?.lessonStartTime === "string") {
        setLessonStartTime(d.lessonStartTime);
      }
      if (typeof d?.lessonEndTime === "string") {
        setLessonEndTime(d.lessonEndTime);
      }
    } catch {
      // ignore bad drafts
    }
  }, [open, isEditing, draftKey]);

  useEffect(() => {
    if (!open) return;
    if (!studentId) return;
    if (!activeCycle?._id) {
      setLatestLesson(null);
      return;
    }

    (async () => {
      try {
        const latest = await getLatestLesson(studentId, {
          examPreparationCycleId: activeCycle._id,
          instrument: activeCycle.instrument,
        });
        setLatestLesson(latest || null);
      } catch (e) {
        console.warn("Failed to load latest lesson:", e);
        setLatestLesson(null);
      }
    })();
  }, [open, studentId, activeCycle?._id, activeCycle?.instrument]);

  useEffect(() => {
    if (!open || isEditing) return;
    setScales(initScales(gradeScales));
  }, [open, isEditing, gradeScales]);

  useEffect(() => {
    if (!open || isEditing) return;

    const draft = {
      lessonDate,
      lessonStartTime,
      lessonEndTime,
      pieces,
      scales,
      sight,
      aural,
      teacherNarrative,
    };

    localStorage.setItem(draftKey, JSON.stringify(draft));
  }, [
    pieces,
    scales,
    sight,
    aural,
    teacherNarrative,
    lessonStartTime,
    lessonEndTime,
    lessonDate,
    open,
    isEditing,
    draftKey,
  ]);

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

  function handleCopyPieceFromLastLesson(pieceId) {
    const lastPiece = lastPiecesMap[pieceId];
    if (!lastPiece) return;

    setPieces((prev) => ({
      ...prev,
      [pieceId]: {
        criteria: { ...(lastPiece.criteria || {}) },
      },
    }));

    setPieceErrors((prev) => ({
      ...prev,
      [pieceId]: [],
    }));
  }

  async function handleSave({ share = false } = {}) {
    setErr("");

    const todayStr = new Date().toISOString().slice(0, 10);
    if (lessonDate > todayStr) {
      setErr("Date cannot be in the future");
      return;
    }
    if (!lessonStartTime || !lessonEndTime) {
      setErr("Please select lesson start and end time.");
      return;
    }

    const startParts = lessonStartTime.split(":").map(Number);
    const endParts = lessonEndTime.split(":").map(Number);

    const startMinutes = startParts[0] * 60 + startParts[1];
    const endMinutes = endParts[0] * 60 + endParts[1];

    if (endMinutes <= startMinutes) {
      setErr("Lesson end time must be later than lesson start time.");
      return;
    }

    // Only validate pieces that were actually touched today
    const nextErrors = {};
    for (const p of activePieces) {
      if (isPieceTouched(pieces[p.id])) {
        const missing = getMissingPieceCriteria(pieces?.[p.id], p.criteria);
        if (missing.length) nextErrors[p.id] = missing;
      }
    }
    if (Object.keys(nextErrors).length) {
      setPieceErrors(nextErrors);
      setErr("Please fill out all criteria for pieces you've started grading.");
      return;
    } else {
      setPieceErrors({});
    }

    try {
      setBusy(true);

      // ── Carry-forward logic ──
      // For each element — if not touched today, use last lesson's data
      let finalPieces;

      if (editLesson) {
        // EDIT MODE → use EXACT state
        finalPieces = pieces;
      } else {
        // CREATE MODE → use carry-forward
        finalPieces = {};
        for (const p of activePieces) {
          const touched = isPieceTouched(pieces?.[p.id]);
          finalPieces[p.id] = touched
            ? pieces[p.id]
            : lastPiecesMap[p.id] || { criteria: {} };
        }
      }

      const scalesTouched = isScalesTouched(scales);
      const finalScales = editLesson
        ? scales
        : scalesTouched
          ? scales
          : lastScalesMap;
      const finalScalesPercent = editLesson
        ? scalesPercent
        : scalesTouched
          ? scalesPercent
          : lastScalesPercent;

      const sightTouched = isSightAuralTouched(sight);
      const finalSight = editLesson
        ? sight
        : sightTouched
          ? sight
          : lastSight || null;

      const auralTouched = isSightAuralTouched(aural);
      const finalAural = editLesson
        ? aural
        : auralTouched
          ? aural
          : lastAural || null;

      // Recompute piece percents using final (merged) pieces
      const finalPiecePercents = {};
      for (const p of activePieces) {
        finalPiecePercents[p.id] = computePiecePercent(
          finalPieces[p.id],
          p.criteria,
        );
      }

      // 1) Update progress snapshot
      const scoreMap = {
        pieceA: finalPiecePercents.pieceA ?? piecePercents.pieceA,
        pieceB: finalPiecePercents.pieceB ?? piecePercents.pieceB,
        pieceC: finalPiecePercents.pieceC ?? piecePercents.pieceC,
      };
      if (isPerformance) {
        scoreMap.pieceD = finalPiecePercents.pieceD ?? piecePercents.pieceD;
      }
      if (showScales) scoreMap.scales = finalScalesPercent;
      if (showSightReading) scoreMap.sightReading = finalSight?.score ?? null;
      if (showAural) scoreMap.auralTraining = finalAural?.score ?? null;
      const nextItems = mergeIntoProgressItems(items, scoreMap);

      if (onSaveScores) {
        await onSaveScores(nextItems, {
          examPreparationCycleId: activeCycle?._id,
          instrument: activeCycle?.instrument,
          lessonDate,
        });
      }

      // 2) Save full lesson payload
      const lessonPayload = buildLessonPayload({
        lessonDate,
        studentId,
        examPreparationCycleId: activeCycle?._id,
        instrument: activeCycle?.instrument,
        pieces: finalPieces,
        piecePercents: finalPiecePercents,
        scales: finalScales,
        scalesPercent: finalScalesPercent,
        sight: finalSight,
        aural: finalAural,
        teacherNarrative,
        share,
        lessonStartTime,
        lessonEndTime,
      });

      const savedLesson = editLesson?._id
        ? await updateLesson(editLesson._id, lessonPayload)
        : await upsertLesson(lessonPayload);

      setLatestLesson(savedLesson);
      onLessonSaved?.(savedLesson);
      localStorage.removeItem(draftKey);
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

            <div className="pp__metaRow">
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
                  <div className="pp__dateDisplay">
                    {formatLocal(lessonDate)}
                  </div>
                </div>
              </div>

              <div className="pp__timeWrap">
                <label className="pp__timeLabel">Lesson time:</label>

                <div className="pp__timeInputs">
                  <select
                    className="pp__timeSelect"
                    value={lessonStartTime}
                    onChange={(e) => setLessonStartTime(e.target.value)}
                    disabled={busy}
                  >
                    <option value="" disabled>
                      Start
                    </option>
                    {TIME_OPTIONS.map((t) => (
                      <option key={`start-${t.value}`} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>

                  <span className="pp__timeDash">—</span>

                  <select
                    className="pp__timeSelect"
                    value={lessonEndTime}
                    onChange={(e) => setLessonEndTime(e.target.value)}
                    disabled={busy}
                  >
                    <option value="">End</option>
                    {TIME_OPTIONS.map((t) => (
                      <option key={`end-${t.value}`} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
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
                value={pieces[p.id] || { criteria: {} }}
                last={lastPiecesMap[p.id] || { criteria: {} }}
                percent={piecePercents[p.id]}
                missingCriteria={pieceErrors[p.id] || []}
                onFocusCriterion={() =>
                  setPieceErrors((prev) => ({ ...prev, [p.id]: [] }))
                } // clear errors for this piece when user focuses any criterion
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
                onCopyLastLesson={() => handleCopyPieceFromLastLesson(p.id)}
                canCopyLastLesson={!!lastPiecesMap[p.id]}
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
                lessonStartTime,
                lessonEndTime,
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
    </div>
  );
}
