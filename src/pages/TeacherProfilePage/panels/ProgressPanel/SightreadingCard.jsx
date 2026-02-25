import "./SkillCards.css";

export default function SightreadingCard({
  title = "Sight-Reading",
  value, // today's block: { score, pitchAccuracy, rhythmAccuracy, adequateTempo, confidentPresentation }
  last, // last class block: same shape (optional)
  disabled,
  onChange, // (key, value) => void
  idPrefix = "sightreading",
}) {
  const today = value || {};
  const prev = last || {};

  const FIELDS = [
    ["Score (%)", "score", "number", "0–100"],
    ["Pitch Accuracy", "pitchAccuracy", "text", "Note…"],
    ["Rhythm Accuracy", "rhythmAccuracy", "text", "Note…"],
    ["Adequate Tempo", "adequateTempo", "text", "Note…"],
    ["Confident Presentation", "confidentPresentation", "text", "Note…"],
  ];

  return (
    <article className="sk__card">
      {/* header bar */}
      <div className="sk__head">
        <div className="sk__title">{title}</div>
        {/* optional right side value later (like a computed %) */}
        <div className="sk__percent">
          {Number.isFinite(today.score) ? `${today.score}%` : "—"}
        </div>
      </div>

      {/* column titles */}
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

            {/* LAST */}
            <div className="sk__last">
              <div className="sk__lastNote">
                {key === "score"
                  ? Number.isFinite(prev.score)
                    ? `${prev.score}%`
                    : "—"
                  : prev[key] || "—"}
              </div>
            </div>

            {/* TODAY */}
            <div className="sk__today">
              {type === "number" ? (
                <input
                  id={`${idPrefix}-today-${key}`}
                  name={`${idPrefix}-today-${key}`}
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
                  id={`${idPrefix}-${key}_sightreading`}
                  name={`${idPrefix}-${key}_sightreading`}
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
