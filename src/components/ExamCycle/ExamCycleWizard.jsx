import { useState, useCallback } from "react";
import Modal from "../Modal/Modal";
import WizardPanel from "../WizardPanel/WizardPanel";
import { createExamCycle } from "../../lib/examCycleApi";
import { ABRSM_PIECES } from "../../data/abrsmSyllabus";
import "./ExamCycleWizard.css";

const STEPS = [
  "Exam Details",
  "Exam Pieces",
  "Grading Overview",
  "Confirmation",
];

const STEP_SUBTITLES = (studentName, pieceCount) => [
  `Set up a new exam preparation cycle for ${studentName}`,
  `Enter the ${pieceCount} pieces for this exam`,
  "ABRSM assessment standards for tracking progress",
  null,
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

const LIST_MAP = { pieceA: "A", pieceB: "B", pieceC: "C", pieceD: "D" };

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

  /* ── shared component list renderer ── */

  function renderComponentList() {
    return (
      <div className="ecw__componentList">
        {isPerformance ? (
          <>
            <div className="ecw__componentItem">
              <span className="ecw__componentIcon">✓</span>
              <span className="ecw__componentLabel">4 Pieces</span>
              <span className="ecw__componentMeta">
                30 marks each · 120 total
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="ecw__componentItem">
              <span className="ecw__componentIcon">✓</span>
              <span className="ecw__componentLabel">3 Pieces</span>
              <span className="ecw__componentMeta">
                30 marks each · 90 total
              </span>
            </div>
            <div className="ecw__componentItem">
              <span className="ecw__componentIcon">✓</span>
              <span className="ecw__componentLabel">
                Scales &amp; Arpeggios
              </span>
              <span className="ecw__componentMeta">21 marks</span>
            </div>
            <div className="ecw__componentItem">
              <span className="ecw__componentIcon">✓</span>
              <span className="ecw__componentLabel">Sight-Reading</span>
              <span className="ecw__componentMeta">21 marks</span>
            </div>
            <div className="ecw__componentItem">
              <span className="ecw__componentIcon">✓</span>
              <span className="ecw__componentLabel">Aural Tests</span>
              <span className="ecw__componentMeta">18 marks</span>
            </div>
          </>
        )}
      </div>
    );
  }

  /* ── syllabus dropdown helper ── */

  function getOptionsForPiece(pieceIndex) {
    const piece = pieces[pieceIndex];
    const listKey = LIST_MAP[piece.key];
    const grade = Number(examGrade);
    const syllabusData = ABRSM_PIECES[examType]?.[grade];
    if (!syllabusData || !listKey) return [];

    const fullList = syllabusData[listKey] ?? [];

    // Filter out pieces already selected in other dropdowns
    const selectedTitles = pieces
      .filter((_, i) => i !== pieceIndex)
      .map((p) => p.title)
      .filter(Boolean);

    return fullList.filter((opt) => !selectedTitles.includes(opt.title));
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
    const subtitle = STEP_SUBTITLES(studentName, pieces.length)[0];
    return (
      <div className="ecw__stepBody">
        <h2 className="ecw__title">{STEPS[step]}</h2>
        <p className="ecw__subtitle">{subtitle}</p>

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
    const subtitle = STEP_SUBTITLES(studentName, pieces.length)[1];
    const hasTypeAndGrade = examType && examGrade;

    return (
      <div className="ecw__stepBody">
        <h2 className="ecw__title">{STEPS[step]}</h2>
        <p className="ecw__subtitle">
          {" "}
          Select the pieces this student will prepare for this exam.
        </p>

        <div className="spModal__section">
          <div className="spModal__sectionBody">
            <p className="ecw__hint"></p>

            {pieces.map((p, i) => {
              const options = hasTypeAndGrade ? getOptionsForPiece(i) : [];
              const currentValue =
                p.title && p.composer ? `${p.title}|||${p.composer}` : "";

              return (
                <div key={p.key} className="ecw__pieceGroup">
                  <span className="ecw__pieceCaption">
                    {p.label.toUpperCase()}
                  </span>
                  <label className="spModal__field">
                    {!hasTypeAndGrade ? (
                      <select className="spModal__input" disabled>
                        <option value="">
                          — Select exam type and grade first —
                        </option>
                      </select>
                    ) : options.length === 0 && !currentValue ? (
                      <select className="spModal__input" disabled>
                        <option value="">
                          All pieces in this list have been selected.
                        </option>
                      </select>
                    ) : (
                      <select
                        className="spModal__input"
                        value={currentValue}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) {
                            updatePiece(i, "title", "");
                            updatePiece(i, "composer", "");
                          } else {
                            const [title, composer] = val.split("|||");
                            updatePiece(i, "title", title);
                            updatePiece(i, "composer", composer);
                          }
                        }}
                      >
                        <option value="">Select a piece…</option>
                        {currentValue &&
                          !options.find(
                            (o) =>
                              `${o.title}|||${o.composer}` === currentValue,
                          ) && (
                            <option value={currentValue}>
                              {p.title} — {p.composer}
                            </option>
                          )}
                        {options.map((o) => (
                          <option
                            key={`${o.title}|||${o.composer}`}
                            value={`${o.title}|||${o.composer}`}
                          >
                            {o.title} — {o.composer}
                          </option>
                        ))}
                      </select>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function renderGradingOverview() {
    const subtitle = STEP_SUBTITLES(studentName, pieces.length)[2];
    return (
      <div className="ecw__stepBody">
        <h2 className="ecw__title">{STEPS[step]}</h2>
        <p className="ecw__subtitle">{subtitle}</p>

        {/* Section 1 — Grading Scale */}
        <div className="ecw__gradingBox">
          <div className="ecw__gradingTitle" style={{ fontSize: "1.25rem" }}>
            ABRSM Grading Scale
          </div>
          <div className="ecw__gradingSubtitle">
            Each piece is graded 0–6 on five criteria:
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
        <div
          className="spModal__readinessWhiteBox"
          style={{ marginBottom: "1.5rem" }}
        >
          <span className="ecw__threshold">Readiness Threshold: 67%</span>
          <p className="ecw__hint" style={{ marginTop: "0.75rem" }}>
            Students scoring 67% or above are considered exam-ready. This helps
            track progress towards exam preparedness.
          </p>
        </div>

        {/* Section 3 — What's Included */}
        <p className="ecw__hint" style={{ marginTop: "0.75rem" }}>
          This{" "}
          {examType === "ABRSM - Performance" ? "Performance" : "Practical"}{" "}
          exam cycle will include:
        </p>
        {renderComponentList()}
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
        <div className="ecw__nextStepsCard">
          <p className="ecw__lastPageCardTitle">What's included:</p>
          {renderComponentList()}
        </div>
        <div className="ecw__nextStepsCard">
          <div className="ecw__nextStepsTitle">Next steps after creation:</div>
          <ol className="ecw__nextStepsList">
            <li>Grade the first lesson in "Today's Progress"</li>
            <li>Assign homework for this week</li>
            <li>Track progress on the main dashboard</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      panelClassName="ecw__panel"
      title={null}
      variant="slideRight"
    >
      <WizardPanel
        stepCount={STEPS.length}
        currentStep={step}
        error={err}
        footer={
          <>
            {step > 0 && (
              <button className="wp__btn-back" onClick={back} disabled={busy}>
                ← Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < STEPS.length - 1 ? (
              <button
                className="wp__btn-next"
                onClick={next}
                disabled={!canAdvance()}
              >
                Continue →
              </button>
            ) : (
              <button
                className="wp__btn-next"
                onClick={handleSubmit}
                disabled={busy}
              >
                {busy ? "Creating…" : "Create Exam Cycle"}
              </button>
            )}
          </>
        }
      >
        {renderStepContent()}
      </WizardPanel>
    </Modal>
  );
}
