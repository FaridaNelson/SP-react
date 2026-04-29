import { useState } from "react";
import "./LessonCard.css";

/* ── Helpers ── */

function parseLessonDate(dateStr) {
  if (!dateStr) return new Date();
  const s = String(dateStr).slice(0, 10);
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatLessonMeta(lesson) {
  if (!lesson.lessonStartAt) return "";

  const start = new Date(lesson.lessonStartAt);

  const timeStr = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (!lesson.lessonEndAt) return timeStr;

  const mins = Math.round((new Date(lesson.lessonEndAt) - start) / 60000);

  return `${timeStr} · ${mins} min`;
}

/* ── Label maps ── */

const PIECE_LABELS = {
  pieceA: "Piece A",
  pieceB: "Piece B",
  pieceC: "Piece C",
  pieceD: "Piece D",
};

const CRITERION_LABELS = {
  technique: "Technique",
  noteAccuracy: "Notes",
  musicality: "Musicality",
  memory: "Memory",
  performance: "Performance",
};

function criterionLabel(id) {
  return (
    CRITERION_LABELS[id] || (id ? id.charAt(0).toUpperCase() + id.slice(1) : id)
  );
}

function scoreBadgeStyle(score) {
  if (score >= 5)
    return { background: "rgba(122,158,135,0.15)", color: "#5A8A6A" };
  if (score >= 3)
    return { background: "rgba(201,168,76,0.12)", color: "#A07820" };
  return { background: "rgba(212,128,106,0.12)", color: "#C05040" };
}

function percentBarColor(pct) {
  if (pct >= 67) return { fill: "var(--sage)", text: "#5A8A6A" };
  if (pct >= 50) return { fill: "var(--gold)", text: "#A07820" };
  return { fill: "var(--rose)", text: "#C05040" };
}

function PercentBar({ pct, label }) {
  const { fill, text } = percentBarColor(pct);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
        marginTop: 18,
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "var(--ink-soft)",
          width: 90,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 5,
          background: "rgba(28,26,23,0.07)",
          borderRadius: 3,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${pct}%`,
            background: fill,
            borderRadius: 3,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "67%",
            top: -2,
            bottom: -2,
            width: 1.5,
            background: "var(--ink)",
            opacity: 0.2,
            borderRadius: 1,
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 16,
          fontWeight: 500,
          width: 36,
          textAlign: "right",
          flexShrink: 0,
          color: text,
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

function ScaleName({ name }) {
  const match = name.match(/^(.*?(?:Major|Minor))(.*)/);
  if (!match) return <span className="scale-name-display">{name}</span>;
  return (
    <span className="scale-name-display">
      {match[1].trim()}
      <br />
      {match[2].trim()}
    </span>
  );
}

/* ── Lesson body renderer ── */

function LessonBody({ lesson, cycle }) {
  if (!cycle) {
    if (process.env.NODE_ENV === "development") {
      console.warn("LessonCard missing cycle for lesson:", {
        lessonId: lesson?._id,
        lesson,
      });
    }
  }

  const piecesWithCriteria = (lesson.pieces || []).filter((p) =>
    p.criteria?.some((c) => c.score !== null && c.score !== undefined),
  );
  const requiredElements = cycle?.progressSummary?.requiredElements || [];

  const showScales =
    requiredElements.length > 0
      ? requiredElements.includes("scales")
      : cycle?.examType === "Performance"
        ? false
        : true;

  const showSightReading =
    requiredElements.length > 0
      ? requiredElements.includes("sightReading")
      : cycle?.examType !== "Performance";

  const showAural =
    requiredElements.length > 0
      ? requiredElements.includes("auralTraining")
      : cycle?.examType !== "Performance";

  const scaleItems = showScales ? lesson.scales?.items || [] : [];
  const sightScore = showSightReading ? lesson.sightReading?.score : null;
  const auralScore = showAural ? lesson.auralTraining?.score : null;

  function formatScaleName(scaleId) {
    if (!scaleId) return "";
    return scaleId
      .replace(/^g\d+_/, "") // strip grade prefix g7_
      .replace(/_(ht|hs|rh|lh)$/, "") // strip hand suffix
      .replace(/_/g, " ") // underscores → spaces
      .replace(/\b\w/g, (c) => c.toUpperCase()) // capitalise each word
      .replace(/([A-G])s\b/g, "$1♯") // Cs → C♯
      .replace(/([A-G])b\b/g, "$1♭") // Bb → B♭, Db → D♭
      .replace(/\bSm\b/g, "Similar Motion") // Sm → Similar Motion
      .replace(/\bArp\b/g, "Arpeggio") // Arp → Arpeggio
      .replace(/\bDom7\b/g, "Dominant 7th") // Dom7 → Dominant 7th
      .replace(/\bDim7\b/g, "Diminished 7th"); // Dim7 → Diminished 7th
  }

  return (
    <>
      {/* Lesson Note — always rendered */}
      <div className="lesson-section">
        <div className="lesson-section-title">Lesson Note</div>
        <div className="lesson-note-display">
          {lesson.teacherNarrative || "No note added."}
        </div>
      </div>

      {/* Pieces with criteria — table view */}
      {piecesWithCriteria.length > 0 &&
        (() => {
          // Collect criterion IDs that have at least one non-null score
          const allCriterionIds = [];
          const seen = new Set();
          for (const piece of piecesWithCriteria) {
            for (const c of piece.criteria) {
              if (
                c.score !== null &&
                c.score !== undefined &&
                !seen.has(c.criterionId)
              ) {
                seen.add(c.criterionId);
                allCriterionIds.push(c.criterionId);
              }
            }
          }

          const gridCols = `100px ${allCriterionIds.map(() => "1fr").join(" ")} 1fr ${allCriterionIds.length}fr`;

          return (
            <div className="lesson-section">
              <div className="lesson-section-title">Pieces</div>
              <div className="lesson-piece-table">
                {/* Header row */}
                <div
                  className="lesson-piece-header-row"
                  style={{ gridTemplateColumns: gridCols }}
                >
                  <span>Piece</span>
                  {allCriterionIds.map((id) => (
                    <span key={id} className="lesson-piece-cell">
                      {criterionLabel(id)}
                    </span>
                  ))}
                  <span className="lesson-piece-cell">Readiness</span>
                  <span>Notes</span>
                </div>

                {/* Data rows */}
                {piecesWithCriteria.map((piece) => {
                  // Combine all criterion notes into one string
                  const notes = piece.criteria
                    .filter((c) => c.note)
                    .map((c) => c.note)
                    .join("; ");

                  return (
                    <div
                      key={piece.pieceId}
                      className="lesson-piece-data-row"
                      style={{ gridTemplateColumns: gridCols }}
                    >
                      <span className="lesson-piece-name">
                        {PIECE_LABELS[piece.pieceId] || piece.pieceId}
                      </span>
                      {allCriterionIds.map((id) => {
                        const crit = piece.criteria.find(
                          (c) => c.criterionId === id,
                        );
                        const score = crit?.score;
                        return (
                          <span
                            key={id}
                            className="lesson-piece-cell"
                            data-label={criterionLabel(id)}
                          >
                            {score !== null && score !== undefined ? (
                              <span
                                className="lesson-score-badge"
                                style={scoreBadgeStyle(score)}
                              >
                                {score}
                              </span>
                            ) : null}
                          </span>
                        );
                      })}
                      <span
                        className="lesson-piece-cell"
                        data-label="Readiness"
                      >
                        {(() => {
                          const pct = Math.round(piece.percent || 0);
                          if (!pct) return null;
                          const color =
                            pct >= 80
                              ? "#5A8A6A"
                              : pct >= 67
                                ? "#A07820"
                                : "#C05040";
                          return (
                            <span
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: 16,
                                fontWeight: 600,
                                color,
                              }}
                            >
                              {pct}%
                            </span>
                          );
                        })()}
                      </span>

                      <span className="lesson-piece-note" data-label="Notes">
                        {notes}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

      {/* Scales */}
      {scaleItems.length > 0 && (
        <div className="lesson-section">
          <div className="lesson-section-title">Scales</div>
          <div className="scale-grade-grid">
            {scaleItems.map((item, i) => {
              const ready = !!item.ready;
              const name = item.scaleId ? formatScaleName(item.scaleId) : "";
              return (
                <div
                  key={i}
                  className={`scale-grade-item ${ready ? "ready" : "not-ready"}`}
                >
                  <span
                    className={`scale-check ${ready ? "ready" : "not-ready"}`}
                  >
                    {ready ? "✓" : "✗"}
                  </span>
                  <ScaleName name={name} />
                  {item.note && (
                    <span className="scale-note-display">{item.note}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sight Reading */}
      {sightScore > 0 && (
        <div className="lesson-section">
          <div className="lesson-section-title">Sight Reading</div>
          <PercentBar pct={Math.round(sightScore)} label="Sight Reading" />
        </div>
      )}

      {/* Aural Training */}
      {auralScore > 0 && (
        <div className="lesson-section">
          <div className="lesson-section-title">Aural Training</div>
          <PercentBar pct={Math.round(auralScore)} label="Aural" />
        </div>
      )}
    </>
  );
}

/* ── Main component ── */

export default function LessonCard({
  lesson,
  cycle,
  readOnly = false,
  onEditLesson,
}) {
  const [bodyOpen, setBodyOpen] = useState(false);
  const d = parseLessonDate(lesson.lessonDate);
  const dayOfWeek = d
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();
  const dateFull = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const lessonMeta = formatLessonMeta(lesson);

  return (
    <div className="lesson-card">
      <div
        className="lesson-card-header"
        onClick={(e) => {
          e.stopPropagation();
          setBodyOpen((v) => !v);
        }}
      >
        <div className="lesson-card-left">
          <div className="lesson-date-badge">
            <div className="lesson-date-day">{dayOfWeek}</div>
            <div className="lesson-date-full">{dateFull}</div>
          </div>
          {lessonMeta && <div className="lesson-meta">{lessonMeta}</div>}
        </div>
        <div
          className="lesson-card-right"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          {/* Total Score */}
          {typeof lesson?.lessonTotalScore === "number" && (
            <span className="lesson-total-score">
              {Math.round(lesson.lessonTotalScore)}%
            </span>
          )}

          {/* Edit Button */}
          {!readOnly && (
            <button
              className="lesson-edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEditLesson?.(lesson);
              }}
            >
              Edit Grades
            </button>
          )}

          {/* Dropdown arrow */}
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
            {bodyOpen ? "▴" : "▾"}
          </span>
        </div>
      </div>

      <div className={`lesson-card-body${bodyOpen ? " open" : ""}`}>
        <LessonBody lesson={lesson} cycle={cycle} />
      </div>
    </div>
  );
}
