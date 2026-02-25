import "./SkillCards.css";

export default function AuralCard({
  title = "Aural Training",
  value, // { score, pitchAccuracy, rhythmAccuracy, adequateTempo, confidentPresentation } for now, per your request
  last,
  disabled,
  onChange,
  idPrefix = "aural",
}) {
  const today = value || {};
  const prev = last || {};

  const FIELDS = [
    ["Score (%)", "score", "number", "0–100"],
    ["Rhythm Accuracy", "rhythmAccuracy", "text", "Note…"],
    ["Singing in-pitch", "singingInPitch", "text", "Note…"],
    ["Musical Memory", "musicalMemory", "text", "Note…"],
    ["Musical Perceptiveness", "musicalPerceptiveness", "text", "Note…"],
  ];

  return (
    <article className="sk__card">
      <div className="sk__head">
        <div className="sk__title">{title}</div>
        <div className="sk__percent">
          {Number.isFinite(today.score) ? `${today.score}%` : "—"}
        </div>
      </div>

      <div className="sk__colsHead">
        <div className="sk__colTitle">
          <div className="sk__colKicker">Last class</div>
          <div className="sk__colSub">Notes</div>
        </div>
        <div className="sk__colTitle">
          <div className="sk__colKicker">Today’s class</div>
          <div className="sk__colSub">Notes</div>
        </div>
      </div>

      <div className="sk__rows">
        {FIELDS.map(([label, key, type, placeholder]) => (
          <div key={key} className="sk__row2">
            <div className="sk__label">{label}</div>

            <div className="sk__last">
              <div className="sk__lastNote">
                {key === "score"
                  ? Number.isFinite(prev.score)
                    ? `${prev.score}%`
                    : "—"
                  : prev[key] || "—"}
              </div>
            </div>

            <div className="sk__today">
              {type === "number" ? (
                <input
                  id={`${idPrefix}-${key}`}
                  name={`${idPrefix}-${key}`}
                  className="sk__input"
                  type="number"
                  min={0}
                  max={100}
                  placeholder={placeholder}
                  value={Number.isFinite(today.score) ? today.score : ""}
                  onChange={(e) =>
                    onChange?.(
                      key,
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                  disabled={disabled}
                />
              ) : (
                <input
                  id={`${idPrefix}-${key}_note`}
                  name={`${idPrefix}-${key}_note`}
                  className="sk__input"
                  type="text"
                  placeholder={placeholder}
                  value={today[key] || ""}
                  onChange={(e) => onChange?.(key, e.target.value)}
                  disabled={disabled}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
