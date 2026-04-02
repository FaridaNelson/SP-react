import { useState } from "react";
import { completeExamCycle, withdrawExamCycle } from "../../lib/examCycleApi";
import Modal from "../Modal/Modal";
import WizardPanel from "../WizardPanel/WizardPanel";
import "./CycleCompleteWizard.css";

const RESULT_OPTIONS = ["Distinction", "Merit", "Pass", "Fail"];
const WITHDRAW_REASONS = [
  "Student not ready",
  "Illness",
  "Schedule conflict",
  "Changed plans",
  "Financial reasons",
  "Other",
];

const viewToStep = { choose: 0, results: 1, withdraw: 1 };

export default function CycleCompleteWizard({
  cycle,
  studentName,
  onSuccess,
  onWithdrawSuccess,
  onClose,
  startOnWithdraw = false,
}) {
  const cycleId = cycle?._id || cycle?.id;
  const isPerformance = cycle?.examType === "Performance";

  // Navigation: "choose" | "results" | "withdraw"
  const [view, setView] = useState(startOnWithdraw ? "withdraw" : "choose");
  const [cameFromChoose, setCameFromChoose] = useState(!startOnWithdraw);

  // Results state
  const [examResult, setExamResult] = useState("");
  const [totalMark, setTotalMark] = useState("");
  const [examinerComments, setExaminerComments] = useState("");
  const [pieceA, setPieceA] = useState("");
  const [pieceB, setPieceB] = useState("");
  const [pieceC, setPieceC] = useState("");
  const [pieceD, setPieceD] = useState("");
  const [scalesScore, setScalesScore] = useState("");
  const [sightScore, setSightScore] = useState("");
  const [auralScore, setAuralScore] = useState("");

  // Withdraw state
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleComplete() {
    if (!examResult) { setErr("Please select an overall result."); return; }
    setBusy(true);
    setErr("");
    try {
      const payload = {
        examTaken: true,
        examDate: cycle?.examDate || undefined,
        closingNote: examinerComments.trim() || undefined,
        completion: {
          result: examResult,
          totalMark: totalMark ? parseInt(totalMark, 10) : undefined,
          pieceScores: {
            pieceA: pieceA ? parseInt(pieceA, 10) : undefined,
            pieceB: pieceB ? parseInt(pieceB, 10) : undefined,
            pieceC: pieceC ? parseInt(pieceC, 10) : undefined,
            ...(isPerformance && pieceD ? { pieceD: parseInt(pieceD, 10) } : {}),
          },
          ...(!isPerformance
            ? {
                componentScores: {
                  scales: scalesScore ? parseInt(scalesScore, 10) : undefined,
                  sightReading: sightScore ? parseInt(sightScore, 10) : undefined,
                  aural: auralScore ? parseInt(auralScore, 10) : undefined,
                },
              }
            : {}),
        },
      };
      const result = await completeExamCycle(cycleId, payload);
      onSuccess?.(result);
    } catch (e) {
      setErr(e?.message || "Failed to complete cycle");
    } finally {
      setBusy(false);
    }
  }

  async function handleWithdraw() {
    if (!reason) { setErr("Please select a reason."); return; }
    setBusy(true);
    setErr("");
    try {
      const payload = {
        withdrawalReason: reason,
        closingNote: notes.trim() || undefined,
      };
      const result = await withdrawExamCycle(cycleId, payload);
      onWithdrawSuccess?.(result);
    } catch (e) {
      setErr(e?.message || "Failed to withdraw cycle");
    } finally {
      setBusy(false);
    }
  }

  function ScoreInput({ label, max, value, onChange }) {
    return (
      <label className="ccw__scoreField">
        <span className="ccw__scoreLabel">{label}</span>
        <div className="ccw__scoreWrap">
          <input
            className="ccw__scoreInput"
            type="number"
            min={0}
            max={max}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={busy}
          />
          <span className="ccw__scoreMax">/ {max}</span>
        </div>
      </label>
    );
  }

  function renderBody() {
    if (view === "choose") return renderChoose();
    if (view === "results") return renderResults();
    return renderWithdraw();
  }

  function renderFooter() {
    if (view === "choose") {
      return (
        <button className="wp__btn-back" onClick={onClose} disabled={busy}>
          Cancel
        </button>
      );
    }

    if (view === "results") {
      return (
        <>
          <button
            className="wp__btn-back"
            onClick={() => setView("choose")}
            disabled={busy}
          >
            ← Back
          </button>
          <div style={{ flex: 1 }} />
          <button
            className="wp__btn-next"
            onClick={handleComplete}
            disabled={busy}
          >
            {busy ? "Saving…" : "Save Results & Complete Cycle"}
          </button>
        </>
      );
    }

    // withdraw
    return (
      <>
        <button
          className="wp__btn-back"
          onClick={() => (cameFromChoose ? setView("choose") : onClose?.())}
          disabled={busy}
        >
          ← Back
        </button>
        <div style={{ flex: 1 }} />
        <button
          className="wp__btn-next"
          onClick={handleWithdraw}
          disabled={busy}
        >
          {busy ? "Saving…" : "Save & Mark as Withdrawn"}
        </button>
      </>
    );
  }

  function renderChoose() {
    return (
      <div className="ccw__viewBody">
        <h2 className="ccw__title">Complete Current Cycle</h2>
        <p className="ccw__subtitle">
          {studentName} is preparing for Grade {cycle?.examGrade ?? "—"}{" "}
          {cycle?.examType ?? "Practical"}
        </p>

        <button
          type="button"
          className="ccw__optionCard"
          onClick={() => { setCameFromChoose(true); setView("results"); setErr(""); }}
        >
          <div className="ccw__optionIcon ccw__optionIcon--sage">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div className="ccw__optionText">
            <div className="ccw__optionTitle">Yes, Exam Taken</div>
            <div className="ccw__optionDesc">Enter exam results and mark cycle as completed</div>
          </div>
        </button>

        <button
          type="button"
          className="ccw__optionCard"
          onClick={() => { setCameFromChoose(true); setView("withdraw"); setErr(""); }}
        >
          <div className="ccw__optionIcon ccw__optionIcon--rose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <div className="ccw__optionText">
            <div className="ccw__optionTitle">No, Exam Not Taken</div>
            <div className="ccw__optionDesc">Record reason for withdrawal</div>
          </div>
        </button>
      </div>
    );
  }

  function renderResults() {
    return (
      <div className="ccw__viewBody">
        <h2 className="ccw__title">Enter Exam Results</h2>
        <p className="ccw__subtitle">Record the official ABRSM results</p>

        <label className="ccw__field">
          <span className="ccw__label">Overall Result</span>
          <select
            className="ccw__select"
            value={examResult}
            onChange={(e) => setExamResult(e.target.value)}
            disabled={busy}
          >
            <option value="">Select result…</option>
            {RESULT_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>

        <ScoreInput label="Total Mark" max={150} value={totalMark} onChange={setTotalMark} />

        <div className="ccw__divider" />
        <h3 className="ccw__sectionH3">
          {isPerformance ? "Piece Scores" : "Component Scores"}
        </h3>

        <div className="ccw__scoreGrid">
          <ScoreInput label="Piece A" max={30} value={pieceA} onChange={setPieceA} />
          <ScoreInput label="Piece B" max={30} value={pieceB} onChange={setPieceB} />
          <ScoreInput label="Piece C" max={30} value={pieceC} onChange={setPieceC} />
          {isPerformance && (
            <ScoreInput label="Piece D" max={30} value={pieceD} onChange={setPieceD} />
          )}
          {!isPerformance && (
            <>
              <ScoreInput label="Scales" max={21} value={scalesScore} onChange={setScalesScore} />
              <ScoreInput label="Sight-reading" max={21} value={sightScore} onChange={setSightScore} />
              <ScoreInput label="Aural" max={18} value={auralScore} onChange={setAuralScore} />
            </>
          )}
        </div>

        <label className="ccw__field">
          <span className="ccw__label">Examiner Comments (optional)</span>
          <textarea
            className="ccw__textarea"
            rows={3}
            placeholder="Any notes from the examiner…"
            value={examinerComments}
            onChange={(e) => setExaminerComments(e.target.value)}
            disabled={busy}
          />
        </label>
      </div>
    );
  }

  function renderWithdraw() {
    return (
      <div className="ccw__viewBody">
        <h2 className="ccw__title">Withdrawal Reason</h2>
        <p className="ccw__subtitle">
          Why didn't {studentName} take the exam?
        </p>

        <label className="ccw__field">
          <span className="ccw__label">Reason for Withdrawal</span>
          <select
            className="ccw__select"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={busy}
            required
          >
            <option value="">Select reason…</option>
            {WITHDRAW_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>

        <label className="ccw__field">
          <span className="ccw__label">Additional Notes (optional)</span>
          <textarea
            className="ccw__textarea"
            rows={3}
            placeholder="Any additional context…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={busy}
          />
        </label>

        <div className="ccw__warning">
          This cycle will be marked as Withdrawn. You can start a new cycle
          for the next grade level.
        </div>
      </div>
    );
  }

  return (
    <Modal open onClose={onClose} panelClassName="ccw__panel">
      <WizardPanel
        stepCount={2}
        currentStep={viewToStep[view]}
        error={err}
        footer={renderFooter()}
      >
        {renderBody()}
      </WizardPanel>
    </Modal>
  );
}
