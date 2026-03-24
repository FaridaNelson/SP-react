import { useState, useCallback } from "react";
import Modal from "../Modal/Modal";
import { createExamCycle } from "../../lib/examCycleApi";
import "./ExamCycleWizard.css";

const STEPS = [
  "Exam Type",
  "Pieces",
  "Components",
  "Initial Assessment",
  "Confirmation",
];

const EXAM_TYPES = [
  {
    label: "ABRSM - Practical",
    value: "ABRSM - Practical",
    desc: "Scales, pieces, sight-reading, and aural tests",
  },
  {
    label: "ABRSM - Performance",
    value: "ABRSM - Performance",
    desc: "Four pieces performed in a recital-style setting",
  },
];

const GRADES = Array.from({ length: 8 }, (_, i) => i + 1);

const PIECES_3 = [
  { key: "pieceA", label: "Piece A", title: "", composer: "" },
  { key: "pieceB", label: "Piece B", title: "", composer: "" },
  { key: "pieceC", label: "Piece C", title: "", composer: "" },
];

const PIECES_4 = [
  ...PIECES_3,
  { key: "pieceD", label: "Piece D", title: "", composer: "" },
];

const DEFAULT_COMPONENTS = {
  scales: true,
  sightReading: true,
  auralTraining: true,
};

const DEFAULT_ASSESSMENT = {
  pieceA: 0,
  pieceB: 0,
  pieceC: 0,
  pieceD: 0,
  scales: 0,
  sightReading: 0,
  auralTraining: 0,
};

export default function ExamCycleWizard({
  studentId,
  instrument,
  onSuccess,
  onClose,
}) {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // Step 1 — Exam type
  const [examType, setExamType] = useState("");
  const [examGrade, setExamGrade] = useState("");
  const [examDate, setExamDate] = useState("");

  // Step 2 — Pieces
  const [pieces, setPieces] = useState(PIECES_3);

  function handleExamTypeChange(value) {
    setExamType(value);
    setPieces(value === "ABRSM - Performance" ? PIECES_4 : PIECES_3);
  }

  // Step 3 — Components
  const [components, setComponents] = useState(DEFAULT_COMPONENTS);

  // Step 4 — Initial assessment
  const [assessment, setAssessment] = useState(DEFAULT_ASSESSMENT);

  const isPerformance = examType === "ABRSM - Performance";

  function updatePiece(index, field, value) {
    setPieces((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  }

  function toggleComponent(key) {
    setComponents((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function setScore(key, value) {
    const num = Math.min(100, Math.max(0, Number(value) || 0));
    setAssessment((prev) => ({ ...prev, [key]: num }));
  }

  /* ── validation per step ── */

  function canAdvance() {
    switch (step) {
      case 0:
        return examType && examGrade;
      case 1:
        return pieces.every((p) => p.title.trim());
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  }

  function next() {
    setErr("");
    if (step < STEPS.length - 1) {
      // Skip Components step (2) for Performance
      const nextStep = step === 1 && isPerformance ? 3 : step + 1;
      setStep(nextStep);
    }
  }

  function back() {
    setErr("");
    if (step > 0) {
      // Skip Components step (2) for Performance
      const prevStep = step === 3 && isPerformance ? 1 : step - 1;
      setStep(prevStep);
    }
  }

  /* ── submit ── */

  const handleSubmit = useCallback(async () => {
    setBusy(true);
    setErr("");

    const payload = {
      studentId,
      instrument: instrument || "Piano",
      examType,
      examGrade,
      examDate: examDate || undefined,
      pieces: pieces
        .filter((p) => p.title.trim())
        .map((p) => ({ key: p.key, label: p.label, title: p.title, composer: p.composer })),
      components: isPerformance
        ? {}
        : {
            scales: components.scales,
            sightReading: components.sightReading,
            auralTraining: components.auralTraining,
          },
      initialAssessment: assessment,
    };

    try {
      const created = await createExamCycle(payload);
      onSuccess?.(created);
    } catch (e) {
      setErr(e?.message || "Failed to create exam cycle");
    } finally {
      setBusy(false);
    }
  }, [
    studentId,
    instrument,
    examType,
    examGrade,
    examDate,
    pieces,
    isPerformance,
    components,
    assessment,
    onSuccess,
  ]);

  /* ── render helpers ── */

  function renderStepContent() {
    switch (step) {
      case 0:
        return renderExamType();
      case 1:
        return renderPieces();
      case 2:
        return renderComponents();
      case 3:
        return renderAssessment();
      case 4:
        return renderConfirmation();
      default:
        return null;
    }
  }

  function renderExamType() {
    return (
      <div className="ecw__stepBody">
        <div className="spModal__section">
          <div className="spModal__sectionHead">
            <h3 className="spModal__sectionTitle">Select Exam Type</h3>
          </div>
          <div className="spModal__sectionBody">
            <div className="ecw__typeGrid">
              {EXAM_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={`ecw__typeCard ${examType === t.value ? "ecw__typeCard--active" : ""}`}
                  onClick={() => handleExamTypeChange(t.value)}
                >
                  <span className="ecw__typeLabel">{t.label}</span>
                  <span className="ecw__typeDesc">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="spModal__section">
          <div className="spModal__sectionHead">
            <h3 className="spModal__sectionTitle">Grade &amp; Date</h3>
          </div>
          <div className="spModal__sectionBody">
            <div className="spModal__grid">
              <label className="spModal__field">
                <span className="spModal__label">EXAM GRADE</span>
                <select
                  className="spModal__input"
                  value={examGrade}
                  onChange={(e) => setExamGrade(e.target.value)}
                >
                  <option value="">Select grade</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
              </label>

              <label className="spModal__field">
                <span className="spModal__label">EXAM DATE (OPTIONAL)</span>
                <input
                  className="spModal__input"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderPieces() {
    return (
      <div className="ecw__stepBody">
        <div className="spModal__section">
          <div className="spModal__sectionHead">
            <h3 className="spModal__sectionTitle">Programme Pieces</h3>
          </div>
          <div className="spModal__sectionBody">
            <p className="ecw__hint">
              Enter the pieces this student will prepare for the exam.
            </p>

            {pieces.map((p, i) => (
              <div key={p.key} className="ecw__pieceRow">
                <div className="ecw__pieceLabel">{p.label}</div>
                <div className="spModal__grid">
                  <label className="spModal__field">
                    <span className="spModal__label">TITLE</span>
                    <input
                      className="spModal__input"
                      placeholder="e.g., Sonatina in C"
                      value={p.title}
                      onChange={(e) => updatePiece(i, "title", e.target.value)}
                    />
                  </label>
                  <label className="spModal__field">
                    <span className="spModal__label">COMPOSER</span>
                    <input
                      className="spModal__input"
                      placeholder="e.g., Clementi"
                      value={p.composer}
                      onChange={(e) =>
                        updatePiece(i, "composer", e.target.value)
                      }
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderComponents() {
    if (isPerformance) {
      return (
        <div className="ecw__stepBody">
          <div className="spModal__section">
            <div className="spModal__sectionHead">
              <h3 className="spModal__sectionTitle">Exam Components</h3>
            </div>
            <div className="spModal__sectionBody">
              <p className="ecw__hint">
                Performance exams focus exclusively on pieces. No additional
                components are required.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="ecw__stepBody">
        <div className="spModal__section">
          <div className="spModal__sectionHead">
            <h3 className="spModal__sectionTitle">Exam Components</h3>
          </div>
          <div className="spModal__sectionBody">
            <p className="ecw__hint">
              Toggle the components included in this practical exam.
            </p>

            <div className="ecw__toggleList">
              {[
                { key: "scales", label: "Scales & Arpeggios" },
                { key: "sightReading", label: "Sight Reading" },
                { key: "auralTraining", label: "Aural Training" },
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className={`ecw__toggleItem ${components[c.key] ? "ecw__toggleItem--on" : ""}`}
                  onClick={() => toggleComponent(c.key)}
                >
                  <span className="ecw__toggleCheck">
                    {components[c.key] ? "\u2713" : ""}
                  </span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderAssessment() {
    const fields = [
      { key: "pieceA", label: "Piece A" },
      { key: "pieceB", label: "Piece B" },
      { key: "pieceC", label: "Piece C" },
    ];

    if (isPerformance) {
      fields.push({ key: "pieceD", label: "Piece D" });
    }

    if (!isPerformance) {
      if (components.scales) fields.push({ key: "scales", label: "Scales" });
      if (components.sightReading)
        fields.push({ key: "sightReading", label: "Sight Reading" });
      if (components.auralTraining)
        fields.push({ key: "auralTraining", label: "Aural Training" });
    }

    return (
      <div className="ecw__stepBody">
        <div className="spModal__section">
          <div className="spModal__sectionHead">
            <h3 className="spModal__sectionTitle">Initial Assessment</h3>
          </div>
          <div className="spModal__sectionBody">
            <p className="ecw__hint">
              Set baseline scores (0–100) for each component. You can adjust
              these later.
            </p>

            <div className="ecw__assessGrid">
              {fields.map((f) => (
                <label key={f.key} className="ecw__assessRow">
                  <span className="ecw__assessLabel">{f.label}</span>
                  <div className="ecw__assessInput">
                    <input
                      className="spModal__input"
                      type="number"
                      min="0"
                      max="100"
                      value={assessment[f.key]}
                      onChange={(e) => setScore(f.key, e.target.value)}
                    />
                    <span className="ecw__assessPct">%</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderConfirmation() {
    const activePieces = pieces.filter((p) => p.title.trim());
    return (
      <div className="ecw__stepBody">
        <div className="spModal__section">
          <div className="spModal__sectionHead">
            <h3 className="spModal__sectionTitle">Review &amp; Confirm</h3>
          </div>
          <div className="spModal__sectionBody">
            <div className="ecw__reviewGrid">
              <div className="ecw__reviewRow">
                <span className="ecw__reviewLabel">Exam Type</span>
                <span className="ecw__reviewValue">{examType || "—"}</span>
              </div>
              <div className="ecw__reviewRow">
                <span className="ecw__reviewLabel">Grade</span>
                <span className="ecw__reviewValue">
                  {examGrade ? `Grade ${examGrade}` : "—"}
                </span>
              </div>
              <div className="ecw__reviewRow">
                <span className="ecw__reviewLabel">Instrument</span>
                <span className="ecw__reviewValue">
                  {instrument || "Piano"}
                </span>
              </div>
              {examDate && (
                <div className="ecw__reviewRow">
                  <span className="ecw__reviewLabel">Exam Date</span>
                  <span className="ecw__reviewValue">{examDate}</span>
                </div>
              )}
              <div className="ecw__reviewRow">
                <span className="ecw__reviewLabel">Pieces</span>
                <span className="ecw__reviewValue">
                  {activePieces.length > 0
                    ? activePieces.map((p) => p.title).join(", ")
                    : "—"}
                </span>
              </div>
              {!isPerformance && (
                <div className="ecw__reviewRow">
                  <span className="ecw__reviewLabel">Components</span>
                  <span className="ecw__reviewValue">
                    {[
                      components.scales && "Scales",
                      components.sightReading && "Sight Reading",
                      components.auralTraining && "Aural Training",
                    ]
                      .filter(Boolean)
                      .join(", ") || "None"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      panelClassName="spModal__panel ecw__panel"
      title={null}
      variant="slideRight"
    >
      <div className="spModal__content">
        <header className="spModal__head">
          <div>
            <div className="spModal__kicker">New exam cycle</div>
            <h2 className="spModal__title">{STEPS[step]}</h2>
          </div>
          <button
            type="button"
            className="spModal__close"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        {/* Step indicator */}
        <div className="ecw__steps">
          {STEPS.map((s, i) => {
            const skipped = i === 2 && isPerformance;
            return (
              <div
                key={s}
                className={`ecw__stepDot ${i === step ? "ecw__stepDot--active" : ""} ${i < step && !skipped ? "ecw__stepDot--done" : ""} ${skipped ? "ecw__stepDot--skipped" : ""}`}
              >
                <span className="ecw__stepNum">
                  {skipped ? "—" : i < step ? "\u2713" : i + 1}
                </span>
                <span className="ecw__stepLabel">{s}</span>
              </div>
            );
          })}
        </div>

        <div className="spModal__scroll">{renderStepContent()}</div>

        {err && <p className="spModal__error">{err}</p>}

        <footer className="spModal__foot">
          {step > 0 && (
            <button
              type="button"
              className="spModal__btn"
              onClick={back}
              disabled={busy}
            >
              Back
            </button>
          )}

          <div className="ecw__footSpacer" />

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="spModal__btn spModal__btn--primary"
              onClick={next}
              disabled={!canAdvance()}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              className="spModal__btn spModal__btn--primary"
              onClick={handleSubmit}
              disabled={busy}
            >
              {busy ? "Creating…" : "Create Exam Cycle"}
            </button>
          )}
        </footer>
      </div>
    </Modal>
  );
}
