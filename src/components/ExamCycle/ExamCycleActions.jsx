import { useState } from "react";
import { completeExamCycle, withdrawExamCycle } from "../../lib/examCycleApi";
import "./ExamCycleActions.css";

/* ── Complete Modal ── */

export function CompleteCycleModal({ cycle, onSuccess, onClose }) {
  const [examTaken, setExamTaken] = useState(true);
  const [examDate, setExamDate] = useState("");
  const [closingNote, setClosingNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const cycleId = cycle?._id || cycle?.id;

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");

    try {
      const payload = {
        examTaken,
        examDate: examDate || undefined,
        closingNote: closingNote.trim() || undefined,
      };
      const result = await completeExamCycle(cycleId, payload);
      onSuccess?.(result);
    } catch (e) {
      setErr(e?.message || "Failed to complete exam cycle");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="eca__overlay open"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className="eca__panel"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <form className="eca__body" onSubmit={handleSubmit}>
          <h2 className="eca__title">Complete Exam Cycle</h2>
          <p className="eca__subtitle">
            Mark this cycle as completed for{" "}
            <strong>
              Grade {cycle?.examGrade ?? "—"} {cycle?.examType ?? ""}
            </strong>
            .
          </p>

          <label className="eca__field">
            <span className="eca__label">DID THE STUDENT TAKE THE EXAM?</span>
            <div className="eca__toggleRow">
              <button
                type="button"
                className={`eca__toggle ${examTaken ? "eca__toggle--active" : ""}`}
                onClick={() => setExamTaken(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`eca__toggle ${!examTaken ? "eca__toggle--active" : ""}`}
                onClick={() => setExamTaken(false)}
              >
                No
              </button>
            </div>
          </label>

          <label className="eca__field">
            <span className="eca__label">EXAM DATE (OPTIONAL)</span>
            <input
              className="eca__input"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
          </label>

          <label className="eca__field">
            <span className="eca__label">CLOSING NOTE (OPTIONAL)</span>
            <textarea
              className="eca__input eca__textarea"
              rows={3}
              placeholder="Any final notes about this cycle…"
              value={closingNote}
              onChange={(e) => setClosingNote(e.target.value)}
            />
          </label>

          {err && <p className="eca__error">{err}</p>}

          <div className="eca__actions">
            <button
              type="button"
              className="eca__btn"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="eca__btn eca__btn--sage"
              disabled={busy}
            >
              {busy ? "Completing…" : "Complete Cycle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Withdraw Modal ── */

export function WithdrawCycleModal({ cycle, onSuccess, onClose }) {
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [closingNote, setClosingNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const cycleId = cycle?._id || cycle?.id;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!withdrawalReason.trim()) {
      setErr("A withdrawal reason is required.");
      return;
    }

    setBusy(true);
    setErr("");

    try {
      const payload = {
        withdrawalReason: withdrawalReason.trim(),
        closingNote: closingNote.trim() || undefined,
      };
      const result = await withdrawExamCycle(cycleId, payload);
      onSuccess?.(result);
    } catch (e) {
      setErr(e?.message || "Failed to withdraw exam cycle");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="eca__overlay open"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className="eca__panel"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <form className="eca__body" onSubmit={handleSubmit}>
          <h2 className="eca__title">Withdraw Exam Cycle</h2>
          <p className="eca__subtitle">
            Withdraw from{" "}
            <strong>
              Grade {cycle?.examGrade ?? "—"} {cycle?.examType ?? ""}
            </strong>
            . This action cannot be undone.
          </p>

          <label className="eca__field">
            <span className="eca__label">REASON FOR WITHDRAWAL *</span>
            <textarea
              className="eca__input eca__textarea"
              rows={3}
              placeholder="e.g., Student not ready, schedule conflict…"
              value={withdrawalReason}
              onChange={(e) => setWithdrawalReason(e.target.value)}
              required
            />
          </label>

          <label className="eca__field">
            <span className="eca__label">CLOSING NOTE (OPTIONAL)</span>
            <textarea
              className="eca__input eca__textarea"
              rows={2}
              placeholder="Any additional notes…"
              value={closingNote}
              onChange={(e) => setClosingNote(e.target.value)}
            />
          </label>

          {err && <p className="eca__error">{err}</p>}

          <div className="eca__actions">
            <button
              type="button"
              className="eca__btn"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="eca__btn eca__btn--rose"
              disabled={busy}
            >
              {busy ? "Withdrawing…" : "Withdraw"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
