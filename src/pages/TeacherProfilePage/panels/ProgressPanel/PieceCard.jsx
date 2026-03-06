import "./PieceCard.css";

const SCORE_LABEL = (n) => {
  if (!Number.isFinite(n)) return "";
  if (n <= 1) return "Needs work";
  if (n <= 3) return "Getting there";
  if (n <= 4) return "Good";
  if (n <= 5) return "Very good";
  return "Excellent";
};

const PASS_THRESHOLD = 67;

const getColorClass = (n) => {
  if (n <= 1) return "red";
  if (n <= 3) return "yellow";
  return "green";
};

export default function PieceCard({
  piece,
  value,
  percent, // today's percent for this piece
  last, // last class values: same shape
  lastWeekPercent, // last week's percent for this piece
  onSetScore,
  onSetNote,
  onSavePiece,
  disabled,
  missingCriteria = [],
  onFocusCriterion,
}) {
  const today = value || { criteria: {} };
  const prev = last || { criteria: {} };

  const afterIsPass = Number(percent) >= PASS_THRESHOLD;
  const lastIsPass = Number(lastWeekPercent) >= PASS_THRESHOLD;

  return (
    <article className="pc__card">
      {/* header bar */}
      <div className="pc__head">
        <div className="pc__title">{piece.title}</div>
        <div className="pc__percent">{percent}%</div>
      </div>

      {/* column titles */}
      <div className="pc__colsHead">
        <div className="pc__colTitle">
          <div className="pc__colKicker">Last class</div>
          <div className="pc__colSub">Grade & notes</div>
        </div>
        <div className="pc__colTitle">
          <div className="pc__colKicker">Today’s class</div>
          <div className="pc__colSub">Grade & notes</div>
        </div>
      </div>

      {missingCriteria.length > 0 && (
        <div className="pc__reminder">
          Kind reminder: please score all criteria for this piece.
        </div>
      )}
      {/* rows */}
      <div className="pc__rows">
        {piece.criteria.map((c) => {
          const lastScore = prev.criteria?.[c.id]?.score;
          const lastNote = prev.criteria?.[c.id]?.note || "";

          const curScore = today.criteria?.[c.id]?.score;
          const curNote = today.criteria?.[c.id]?.note || "";
          const isMissing = missingCriteria.includes(c.id);

          return (
            <div
              key={c.id}
              className={`pc__row2 ${isMissing ? "pc__row2--missing" : ""}`}
            >
              <div className="pc__label">{c.label}</div>

              {/* LAST CLASS */}
              <div className="pc__last">
                <div className="pc__lastNote">
                  {lastNote || "Last class note…"}
                </div>

                <div
                  className={`pc__status ${
                    Number.isFinite(lastScore)
                      ? `pc__status--${getColorClass(lastScore)}`
                      : ""
                  }`}
                >
                  {Number.isFinite(lastScore) ? lastScore : "—"}
                </div>
              </div>

              {/* TODAY */}
              <div className="pc__today">
                <div className="pc__scale">
                  {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`pc__pill ${
                        curScore === n
                          ? `pc__pill--active pc__pill--${getColorClass(n)}`
                          : ""
                      }`}
                      onClick={() => {
                        onFocusCriterion?.();
                        onSetScore?.(c.id, n);
                      }}
                      disabled={disabled}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <input
                  id={`note-${piece.id}-${c.id}`}
                  name={`note_${piece.id}_${c.id}`}
                  className="pc__note"
                  placeholder="Note…"
                  value={curNote}
                  onFocus={() => onFocusCriterion?.()}
                  onChange={(e) => onSetNote?.(c.id, e.target.value)}
                  disabled={disabled}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* piece readiness section (bottom) */}
      <div className="pc__readiness">
        <div className="pc__readinessTitle">Piece readiness</div>

        <div className="pc__barRow">
          <span className="pc__barLabel">Last lesson</span>
          <div className="pc__bar">
            <div
              className={`pc__barFill ${
                lastIsPass ? "pc__fill--pass" : "pc__fill--fail"
              }`}
              style={{ width: `${lastWeekPercent}%` }}
            />
            <div className="pc__barMarker" />
          </div>
          <span
            className={`pc__barPct ${lastIsPass ? "pc__pct--pass" : "pc__pct--fail"}`}
          >
            {lastWeekPercent}%
          </span>
        </div>

        <div className="pc__barRow">
          <span className="pc__barLabel">After today</span>
          <div className="pc__bar">
            <div
              className={`pc__barFill ${
                afterIsPass ? "pc__fill--pass" : "pc__fill--fail"
              }`}
              style={{ width: `${percent}%` }}
            />
            <div className="pc__barMarker" />
          </div>
          <span
            className={`pc__barPct ${
              afterIsPass ? "pc__pct--pass" : "pc__pct--fail"
            }`}
          >
            {percent}%
          </span>{" "}
        </div>
      </div>
      <div className="pc__actions">
        <button
          type="button"
          className="pc__saveOne"
          onClick={() => onSavePiece?.(piece.id)}
          disabled={disabled}
          title="Save progress for this piece only"
        >
          Save this piece
        </button>
      </div>
    </article>
  );
}
