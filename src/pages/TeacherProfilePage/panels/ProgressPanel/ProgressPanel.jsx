import { useEffect, useMemo, useState } from "react";
import "./ProgressPanel.css";
import PieceCard from "./PieceCard";
import {
  buildLessonPayload,
  computePiecePercent,
  computeScalesPercent,
  formatLocal,
  initPieces,
  initScales,
  mergeIntoProgressItems,
} from "./scoreMath";
import ScalesCard from "./ScalesCard";
import SightreadingCard from "./SightReadingCard";
import AuralCard from "./AuralCard";
import { upsertLesson, getLatestLesson } from "../../../../lib/lessons";

export default function ProgressPanel({
  open,
  onClose,
  student,
  items = [],
  onSaveScores,
  onLessonSaved,
}) {
  const [lessonDate] = useState(() => new Date().toISOString().slice(0, 10));
  const studentId = student?._id || student?.id;
  const [latestLesson, setLatestLesson] = useState(null);

  // --- config ---
  // Each piece is graded by multiple criteria, each criterion score is 0..6
  const BASE_CRITERIA = useMemo(
    () => [
      { id: "pitch", label: "Pitch" },
      { id: "time", label: "Time" },
      { id: "tone", label: "Tone" },
      { id: "shape", label: "Shape" },
      { id: "performance", label: "Performance" },
    ],
    [],
  );
  const PIECES = useMemo(
    () => [
      {
        id: "pieceA",
        title: "Piece A",
        criteria: BASE_CRITERIA,
      },
      {
        id: "pieceB",
        title: "Piece B",
        criteria: BASE_CRITERIA,
      },
      {
        id: "pieceC",
        title: "Piece C",
        criteria: BASE_CRITERIA,
      },
    ],
    [BASE_CRITERIA],
  );

  // Scales list (Phase 1: static example; later you’ll generate this from grade/instrument syllabus)
  const DEFAULT_SCALES = useMemo(
    () => [
      { id: "c_major", label: "C Major" },
      { id: "g_major", label: "G Major" },
      { id: "d_major", label: "D Major" },
      { id: "f_major", label: "F Major" },
      { id: "a_minor_h", label: "A Minor Harmonic" },
      { id: "d_minor_h", label: "D Minor Harmonic" },
      { id: "c_major_contrary", label: "C Major Contrary" },
      { id: "g_major_arpeggio", label: "G Major Arpeggio" },
      { id: "a_minor_arpeggio", label: "A Minor Arpeggio" },
    ],
    [],
  );

  // -------- local state (draft preserved if user closes without saving) --------
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  // pieces state: { pieceId: { criteria: {criterionId: {score, note}}, overallNote } }
  const [pieces, setPieces] = useState(() => initPieces(PIECES));
  // scales state: { scaleId: { ready: true|false|null, note } }
  const [scales, setScales] = useState(() => initScales(DEFAULT_SCALES));
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
    setScales(initScales(DEFAULT_SCALES));
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
  }, [open, PIECES, DEFAULT_SCALES]);

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

  // --- computed piece percent scores (0..100) based on criteria 0..6 ---
  const piecePercents = useMemo(() => {
    const out = {};
    for (const p of PIECES) {
      out[p.id] = computePiecePercent(pieces?.[p.id], p.criteria);
    }
    return out;
  }, [pieces, PIECES]);

  // --- computed overall “scales percent” (0..100) ---
  const scalesPercent = useMemo(() => computeScalesPercent(scales), [scales]);

  // --- used to show student header ---
  const studentName = student?.name || "Student";

  async function handleSave({ share = false } = {}) {
    setErr("");
    // Phase 1: just update the existing progress snapshot with new scores (no lesson creation yet)

    const todayStr = new Date().toISOString().slice(0, 10);
    if (lessonDate > todayStr) {
      setErr("Date cannot be in the future");
      return;
    }

    try {
      setBusy(true);

      // 1) Update your EXISTING progress snapshot items (Phase 1)
      const nextItems = mergeIntoProgressItems(items, {
        scales: scalesPercent,
        pieceA: piecePercents.pieceA,
        pieceB: piecePercents.pieceB,
        pieceC: piecePercents.pieceC,
        sightReading: sight.score ?? null,
        auralTraining: aural.score ?? null,
      });

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

            <div className="pp__date">{formatLocal(lessonDate)}</div>
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

            {PIECES.map((p) => (
              <PieceCard
                idPrefix={`piece-${p.id}`} // for accessibility; optional but better
                key={p.id}
                piece={p}
                value={pieces[p.id]}
                last={lastPiecesMap[p.id] || { criteria: {} }}
                percent={piecePercents[p.id]}
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

          {/* Scales */}
          <section className="pp__section">
            <h3 className="pp__h3">Scales</h3>

            <ScalesCard
              title="Scales"
              scalesDef={DEFAULT_SCALES}
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

          <SightreadingCard
            idPrefix={`sight-${studentId}-${lessonDate}`} // for accessibility; optional but better
            value={sight}
            last={lastSight}
            disabled={busy}
            onChange={(k, v) => setSight((prev) => ({ ...prev, [k]: v }))}
          />

          <AuralCard
            idPrefix={`aural-${studentId}-${lessonDate}`} // for accessibility; optional but better
            value={aural}
            last={lastAural}
            disabled={busy}
            onChange={(k, v) => setAural((prev) => ({ ...prev, [k]: v }))}
          />

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
