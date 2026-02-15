import { useState } from "react";
import Modal from "../../../components/Modal/Modal";
import "./AddScoreModal.css";

const ELEMENTS = [
  { id: "scales", label: "Scales" },
  { id: "pieceA", label: "Piece A" },
  { id: "pieceB", label: "Piece B" },
  { id: "pieceC", label: "Piece C" },
  { id: "sightReading", label: "Sight-Reading" },
  { id: "auralTraining", label: "AuralTraining" },
];

const ELEMENTS_BY_ID = Object.fromEntries(ELEMENTS.map((e) => [e.id, e.label]));

function toEntries({ date, form }) {
  return Object.entries(form)
    .map(([elementId, v]) => {
      const hasAny =
        v?.score != null ||
        v?.tempoCurrent != null ||
        v?.tempoGoal != null ||
        (v?.dynamics && v.dynamics.trim()) ||
        (v?.articulation && v.articulation.trim());

      if (!hasAny) return null;

      return {
        lessonDate: date, // "YYYY-MM-DD" (backend can parse)
        elementId,
        elementLabel: ELEMENTS_BY_ID[elementId] || elementId,
        score: v.score ?? undefined,
        tempoCurrent: v.tempoCurrent ?? undefined,
        tempoGoal: v.tempoGoal ?? undefined,
        dynamics: v.dynamics?.trim() || undefined,
        articulation: v.articulation?.trim() || undefined,
      };
    })
    .filter(Boolean);
}

export default function AddScoreModal({ open, onClose, onSubmit }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState({}); // key by element id

  const setField = (id, field, value) =>
    setForm((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));

  function handleSubmit(e) {
    e.preventDefault();
    const entries = toEntries({ date, form });
    if (entries.length === 0) {
      // show a UI message instead of submitting empty data
      console.warn("No score fileds filled");
      return;
    }
    onSubmit?.(entries);
  }

  return (
    <Modal open={open} onClose={onClose} title="Add New Score">
      <form className="scoreForm" onSubmit={handleSubmit}>
        <label className="scoreForm__row">
          <span className="scoreForm__label">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        {ELEMENTS.map((el) => {
          const v = form[el.id] || {};
          return (
            <fieldset key={el.id} className="scoreForm__fieldset">
              <h3 className="scoreForm__legend">{el.label}</h3>

              <div className="scoreForm__grid">
                <label>
                  <span className="scoreForm__sublabel">Score (%)</span>
                  <input
                    className="scoreForm__input"
                    type="number"
                    min={0}
                    max={100}
                    value={v.score ?? ""}
                    onChange={(e) =>
                      setField(el.id, "score", Number(e.target.value))
                    }
                  />
                </label>

                <label>
                  <span className="scoreForm__sublabel">Current Tempo</span>
                  <input
                    className="scoreForm__input"
                    type="number"
                    min={0}
                    placeholder="Current Tempo"
                    value={v.tempoCurrent ?? ""}
                    onChange={(e) =>
                      setField(el.id, "tempoCurrent", Number(e.target.value))
                    }
                  />
                </label>

                <label>
                  <span className="scoreForm__sublabel">Goal Tempo</span>
                  <input
                    className="scoreForm__input"
                    type="number"
                    min={0}
                    placeholder="Goal Tempo"
                    value={v.tempoGoal ?? ""}
                    onChange={(e) =>
                      setField(el.id, "tempoGoal", Number(e.target.value))
                    }
                  />
                </label>

                <label className="scoreForm__col">
                  <span className="scoreForm__sublabel">Dynamics</span>
                  <textarea
                    className="scoreForm__input"
                    rows={2}
                    value={v.dynamics ?? ""}
                    onChange={(e) =>
                      setField(el.id, "dynamics", e.target.value)
                    }
                  />
                </label>

                <label className="scoreForm__col">
                  <span className="scoreForm__sublabel">Articulation</span>
                  <textarea
                    className="scoreForm__input"
                    rows={2}
                    value={v.articulation ?? ""}
                    onChange={(e) =>
                      setField(el.id, "articulation", e.target.value)
                    }
                  />
                </label>
              </div>
            </fieldset>
          );
        })}

        <div className="scoreForm__actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn">
            Save Score
          </button>
        </div>
      </form>
    </Modal>
  );
}
