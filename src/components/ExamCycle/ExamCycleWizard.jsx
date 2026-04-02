import { useState, useCallback } from "react";
import Modal from "../Modal/Modal";
import { createExamCycle } from "../../lib/examCycleApi";
import "./ExamCycleWizard.css";

const STEPS = [
  "Exam Details",
  "Exam Pieces",
  "Grading Overview",
  "Confirmation",
];

const EXAM_TYPES = [
  { label: "ABRSM – Practical", value: "ABRSM - Practical" },
  { label: "ABRSM – Performance", value: "ABRSM - Performance" },
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

export default function ExamCycleWizard({
  studentId,
  instrument,
  studentName,
  onSuccess,
  onClose,
}) {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [examType, setExamType] = useState("");
  const [examGrade, setExamGrade] = useState("");
  const [examDate, setExamDate] = useState("");
  const [pieces, setPieces] = useState(PIECES_3);

  const isPerformance = examType === "ABRSM - Performance";

  function handleExamTypeChange(value) {
    setExamType(value);
    setPieces(value === "ABRSM - Performance" ? PIECES_4 : PIECES_3);
  }

  function updatePiece(index, field, value) {
    setPieces((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
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
      default:
        return false;
    }
  }

  function next() {
    setErr("");
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function back() {
    setErr("");
    if (step > 0) setStep(step - 1);
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
        .map((p) => ({
          key: p.key,
          label: p.label,
          title: p.title,
          composer: p.composer,
        })),
    };

    try {
      const created = await createExamCycle(payload);
      onSuccess?.(created);
    } catch (e) {
      setErr(e?.message || "Failed to create exam cycle");
    } finally {
      setBusy(false);
    }
  }, [studentId, instrument, examType, examGrade, examDate, pieces, onSuccess]);

  /* ── shared checklist renderer ── */

  function renderIncludedChecklist() {
    const examTypeLabel = isPerformance ? "Performance" : "Practical";
    return (
      <div className="spModal__section" style={{ marginBottom: 0 }}>
        <div
          className="spModal__sectionHead"
          style={{ marginBottom: 0, background: "#7a9e87" }}
        >
          <h4
            className="spModal__sectionTitle"
            style={{
              marginBottom: 0,
              fontSize: "1.25rem",
              color: "black",
              fontWeight: "600",
            }}
          >
            What&apos;s Included
          </h4>
        </div>
        <p
          className="ecw__hint"
          style={{ marginLeft: "1.25rem", marginTop: "0.5rem" }}
        >
          This {examTypeLabel} exam includes:
        </p>
        <ul className="ecw__checkList" style={{ marginLeft: "1.25rem" }}>
          {isPerformance ? (
            <>
              <li className="ecw__checkItem">
                <span className="ecw__checkIcon">✓</span>
                <span>4 Pieces (30 marks each)</span>
              </li>
            </>
          ) : (
            <>
              <li className="ecw__checkItem">
                <span className="ecw__checkIcon">✓</span>
                <span>3 Pieces (30 marks each, 90 total)</span>
              </li>
              <li className="ecw__checkItem">
                <span className="ecw__checkIcon">✓</span>
                <span>Scales &amp; Arpeggios (21 marks)</span>
              </li>
              <li className="ecw__checkItem">
                <span className="ecw__checkIcon">✓</span>
                <span>Sight-Reading (21 marks)</span>
              </li>
              <li className="ecw__checkItem">
                <span className="ecw__checkIcon">✓</span>
                <span>Aural Tests (18 marks)</span>
              </li>
            </>
          )}
        </ul>
        <p className="ecw__checkTotal">
          {isPerformance
            ? "Total: 120 marks"
            : "Total: 150 marks · Pass threshold: 100 marks (67%)"}
        </p>
      </div>
    );
  }

  /* ── render helpers ── */

  function renderStepContent() {
    switch (step) {
      case 0:
        return renderExamDetails();
      case 1:
        return renderPieces();
      case 2:
        return renderGradingOverview();
      case 3:
        return renderConfirmation();
      default:
        return null;
    }
  }

  function renderExamDetails() {
    return (
      <div className="ecw__stepBody">
        <div className="spModal__section">
          <div className="spModal__sectionHead">
            <h3 className="spModal__sectionTitle">Exam Details</h3>
          </div>
          <div className="spModal__sectionBody">
            <div className="spModal__grid">
              <label className="spModal__field">
                <span className="spModal__label">EXAM TYPE</span>
                <select
                  className="spModal__input"
                  value={examType}
                  onChange={(e) => handleExamTypeChange(e.target.value)}
                >
                  <option value="">Select exam type</option>
                  {EXAM_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="spModal__field">
                <span className="spModal__label">GRADE LEVEL</span>
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
                <span
                  className="ecw__hint"
                  style={{ marginTop: "0.25rem", marginBottom: 0 }}
                >
                  You can set this later if the date isn&apos;t confirmed yet.
                </span>
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
            <h3 className="spModal__sectionTitle">Exam Pieces</h3>
          </div>
          <div className="spModal__sectionBody">
            <p className="ecw__hint">
              Enter the pieces this student will prepare for this exam.
            </p>

            {pieces.map((p, i) => (
              <div key={p.key} className="ecw__pieceGroup">
                <span className="ecw__pieceCaption">
                  {p.label.toUpperCase()}
                </span>
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
                    onChange={(e) => updatePiece(i, "composer", e.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderGradingOverview() {
    return (
      <div className="ecw__stepBody">
        <div className="spModal__section">
          <div className="spModal__sectionBody">
            {/* Section 1 — Grading Scale */}
            <div className="ecw__gradingBox">
              <div
                className="ecw__gradingTitle"
                style={{ fontSize: "1.25rem" }}
              >
                ABRSM Grading Scale
              </div>
              <div className="ecw__gradingSubtitle">
                Each piece is graded 0–6 on four criteria:
              </div>
              <ol className="ecw__gradingList">
                <li>Pitch (Note accuracy)</li>
                <li>Time (Rhythm &amp; Tempo)</li>
                <li>Tone (Dynamics &amp; Musicality)</li>
                <li>Shape (Phrasing &amp; Articulation)</li>
                <li>Performance (Artistry &amp; Expressiveness)</li>
              </ol>
            </div>

            {/* Section 2 — Readiness Threshold */}
            <div style={{ marginBottom: "1.5rem" }}>
              <span className="ecw__threshold">Readiness Threshold: 67%</span>
              <p className="ecw__hint" style={{ marginTop: "0.75rem" }}>
                Students scoring 67% or above are considered exam-ready. This
                helps track progress towards exam preparedness.
              </p>
            </div>

            {/* Section 3 — What's Included */}
            {renderIncludedChecklist()}
          </div>
        </div>
      </div>
    );
  }

  function renderConfirmation() {
    const examTypeLabel = isPerformance
      ? "ABRSM – Performance"
      : "ABRSM – Practical";

    return (
      <div className="ecw__stepBody">
        <div className="ecw__readyCard">
          <div className="ecw__readyCheck">✓</div>
          <h2 className="ecw__readyTitle">Ready to Create Exam Cycle</h2>
          <p className="ecw__readySub">
            Grade {examGrade} {examTypeLabel}
          </p>
          {studentName && (
            <p
              className="ecw__readySub"
              style={{ fontSize: "0.8rem", opacity: 0.5 }}
            >
              for {studentName}
            </p>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, auto)",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {renderIncludedChecklist()}

          <div className="spModal__section">
            <div
              className="spModal__sectionHead"
              style={{ marginBottom: 0, background: "#7a9e87" }}
            >
              <h4
                className="spModal__sectionTitle"
                style={{
                  marginBottom: 0,
                  fontSize: "1.25rem",
                  color: "black",
                  fontWeight: "600",
                }}
              >
                Next steps after creation:
              </h4>
            </div>
            <ul
              className="ecw__nextSteps"
              style={{ marginLeft: "1.25rem", marginTop: "0.5rem" }}
            >
              <li className="ecw__nextStep" style={{ color: "black" }}>
                1. Grade the first lesson in &ldquo;Today&apos;s Progress&rdquo;
              </li>
              <li className="ecw__nextStep" style={{ color: "black" }}>
                2. Assign homework for this week
              </li>
              <li className="ecw__nextStep" style={{ color: "black" }}>
                3. Track progress on the main dashboard
              </li>
            </ul>
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
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`ecw__stepDot ${i === step ? "ecw__stepDot--active" : ""} ${i < step ? "ecw__stepDot--done" : ""}`}
            >
              <span className="ecw__stepNum">{i < step ? "✓" : i + 1}</span>
              <span className="ecw__stepLabel">{s}</span>
            </div>
          ))}
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
