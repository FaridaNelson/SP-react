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
  const hasText = (s) => typeof s === "string" && s.trim().length > 0;

  return Object.entries(form)
    .map(([elementId, v]) => {
      if (!v) return null;

      const isSight = elementId === "sightReading";
      const isAural = elementId === "auralTraining";

      // STANDARD elements (scales/pieces)
      if (!isSight && !isAural) {
        const hasAny =
          v.score != null ||
          v.tempoCurrent != null ||
          v.tempoGoal != null ||
          hasText(v.dynamics) ||
          hasText(v.articulation);

        if (!hasAny) return null;

        return {
          lessonDate: date,
          elementId,
          elementLabel: ELEMENTS_BY_ID[elementId] || elementId,
          score: v.score ?? undefined,
          tempoCurrent: v.tempoCurrent ?? undefined,
          tempoGoal: v.tempoGoal ?? undefined,
          dynamics: v.dynamics?.trim() || undefined,
          articulation: v.articulation?.trim() || undefined,
        };
      }

      // SIGHT READING (no tempos/dynamics/articulation)
      if (isSight) {
        const hasAny =
          v.score != null ||
          hasText(v.pitchAccuracy) ||
          hasText(v.rhythmAccuracy) ||
          hasText(v.adequateTempo) ||
          hasText(v.confidentPresentation);

        if (!hasAny) return null;

        return {
          lessonDate: date,
          elementId,
          elementLabel: ELEMENTS_BY_ID[elementId] || elementId,
          score: v.score ?? undefined,
          pitchAccuracy: v.pitchAccuracy?.trim() || undefined,
          rhythmAccuracy: v.rhythmAccuracy?.trim() || undefined,
          adequateTempo: v.adequateTempo?.trim() || undefined,
          confidentPresentation: v.confidentPresentation?.trim() || undefined,
        };
      }

      // AURAL TRAINING (no tempos/dynamics/articulation)
      const hasAny =
        v.score != null ||
        hasText(v.rhythmAccuracy) ||
        hasText(v.singingInPitch) ||
        hasText(v.musicalMemory) ||
        hasText(v.musicalPerceptiveness);

      if (!hasAny) return null;

      return {
        lessonDate: date,
        elementId,
        elementLabel: ELEMENTS_BY_ID[elementId] || elementId,
        score: v.score ?? undefined,
        rhythmAccuracy: v.rhythmAccuracy?.trim() || undefined,
        singingInPitch: v.singingInPitch?.trim() || undefined,
        musicalMemory: v.musicalMemory?.trim() || undefined,
        musicalPerceptiveness: v.musicalPerceptiveness?.trim() || undefined,
      };
    })
    .filter(Boolean);
}

export default function AddScoreModal({ open, onClose, onSubmit }) {
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(() => today);
  const [form, setForm] = useState({}); // key by element id
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function resetForm() {
    setDate(new Date().toISOString().slice(0, 10));
    setForm({});
    setErr("");
  }

  const setField = (id, field, value) =>
    setForm((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    const entries = toEntries({ date, form });
    if (date > today) {
      setErr("You cannot set a date in the future.");
      return;
    }
    if (entries.length === 0) {
      // show a UI message instead of submitting empty data
      setErr("Please enter at least one score or note before saving.");
      return;
    }
    try {
      setBusy(true);
      await onSubmit?.(entries);
      resetForm();
      onClose();
    } catch (e) {
      setErr(e?.message || "Failed to save score");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add New Score">
      <form className="scoreForm" onSubmit={handleSubmit}>
        <label className="scoreForm__row">
          <span className="scoreForm__label">Date</span>
          <input
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            disabled={busy}
          />
        </label>

        {ELEMENTS.map((el) => {
          const v = form[el.id] || {};
          const isSight = el.id === "sightReading";
          const isAural = el.id === "auralTraining";
          const isStandard = !isSight && !isAural;
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
                    onChange={(e) => {
                      const raw = e.target.value;
                      setField(
                        el.id,
                        "score",
                        raw === "" ? undefined : Number(raw),
                      );
                    }}
                  />
                </label>

                {isStandard && (
                  <>
                    <label>
                      <span className="scoreForm__sublabel">Current Tempo</span>
                      <input
                        className="scoreForm__input"
                        type="number"
                        min={0}
                        placeholder="Current Tempo"
                        value={v.tempoCurrent ?? ""}
                        onChange={(e) => {
                          const raw = e.target.value;
                          setField(
                            el.id,
                            "tempoCurrent",
                            raw === "" ? undefined : Number(raw),
                          );
                        }}
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
                        onChange={(e) => {
                          const raw = e.target.value;
                          setField(
                            el.id,
                            "tempoGoal",
                            raw === "" ? undefined : Number(raw),
                          );
                        }}
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
                  </>
                )}
                {isSight && (
                  <>
                    <label className="scoreForm__col">
                      <span className="scoreForm__sublabel">
                        Pitch Accuracy
                      </span>
                      <textarea
                        className="scoreForm__input"
                        rows={2}
                        value={v.pitchAccuracy ?? ""}
                        onChange={(e) =>
                          setField(el.id, "pitchAccuracy", e.target.value)
                        }
                      />
                    </label>

                    <label className="scoreForm__col">
                      <span className="scoreForm__sublabel">
                        Rhythm Accuracy
                      </span>
                      <textarea
                        className="scoreForm__input"
                        rows={2}
                        value={v.rhythmAccuracy ?? ""}
                        onChange={(e) =>
                          setField(el.id, "rhythmAccuracy", e.target.value)
                        }
                      />
                    </label>

                    <label className="scoreForm__col">
                      <span className="scoreForm__sublabel">
                        Adequate Tempo
                      </span>
                      <textarea
                        className="scoreForm__input"
                        rows={2}
                        value={v.adequateTempo ?? ""}
                        onChange={(e) =>
                          setField(el.id, "adequateTempo", e.target.value)
                        }
                      />
                    </label>

                    <label className="scoreForm__col">
                      <span className="scoreForm__sublabel">
                        Confident Presentation
                      </span>
                      <textarea
                        className="scoreForm__input"
                        rows={2}
                        value={v.confidentPresentation ?? ""}
                        onChange={(e) =>
                          setField(
                            el.id,
                            "confidentPresentation",
                            e.target.value,
                          )
                        }
                      />
                    </label>
                  </>
                )}
                {isAural && (
                  <>
                    <label className="scoreForm__col">
                      <span className="scoreForm__sublabel">
                        Rhythm Accuracy
                      </span>
                      <textarea
                        className="scoreForm__input"
                        rows={2}
                        value={v.rhythmAccuracy ?? ""}
                        onChange={(e) =>
                          setField(el.id, "rhythmAccuracy", e.target.value)
                        }
                      />
                    </label>

                    <label className="scoreForm__col">
                      <span className="scoreForm__sublabel">
                        Singing In-Pitch
                      </span>
                      <textarea
                        className="scoreForm__input"
                        rows={2}
                        value={v.singingInPitch ?? ""}
                        onChange={(e) =>
                          setField(el.id, "singingInPitch", e.target.value)
                        }
                      />
                    </label>

                    <label className="scoreForm__col">
                      <span className="scoreForm__sublabel">
                        Musical Memory
                      </span>
                      <textarea
                        className="scoreForm__input"
                        rows={2}
                        value={v.musicalMemory ?? ""}
                        onChange={(e) =>
                          setField(el.id, "musicalMemory", e.target.value)
                        }
                      />
                    </label>

                    <label className="scoreForm__col">
                      <span className="scoreForm__sublabel">
                        Musical Perceptiveness (styles, genres)
                      </span>
                      <textarea
                        className="scoreForm__input"
                        rows={2}
                        value={v.musicalPerceptiveness ?? ""}
                        onChange={(e) =>
                          setField(
                            el.id,
                            "musicalPerceptiveness",
                            e.target.value,
                          )
                        }
                      />
                    </label>
                  </>
                )}
              </div>
            </fieldset>
          );
        })}

        {err && <p className="error">{err}</p>}
        <div className="scoreForm__actions">
          <button
            type="button"
            className="btn"
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="btn" disabled={busy}>
            Save Score
          </button>
        </div>
      </form>
    </Modal>
  );
}
