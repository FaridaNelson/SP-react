import "./ScalesCard.css";

const PASS_THRESHOLD = 67; // same idea as PieceCard (adjust if you want)

export default function ScalesCard({
  title = "Scales",
  scalesDef = [],
  value = {}, // today's scales map: { [id]: { ready, note } }
  last = {}, // last class scales map: { [id]: { ready, note } } (optional)
  percent = 0, // after today percent
  lastWeekPercent = 0, // last week percent
  onSetReady,
  onSetNote,
  disabled,
}) {
  const afterIsPass = Number(percent) >= PASS_THRESHOLD;
  const lastIsPass = Number(lastWeekPercent) >= PASS_THRESHOLD;

  return (
    <article className="sc__card">
      {/* header bar (match PieceCard styling) */}
      <div className="sc__head">
        <div className="sc__title">{title}</div>
        <div className="sc__percent">{percent}%</div>
      </div>

      {/* column titles */}
      <div className="sc__colsHead sc__colsHead--3">
        <div className="sc__colTitle">
          <div className="sc__colKicker">Scale</div>
        </div>

        <div className="sc__colTitle">
          <div className="sc__colKicker">Last class</div>
          <div className="sc__colSub">Notes & status</div>
        </div>

        <div className="sc__colTitle">
          <div className="sc__colKicker">Today’s class</div>
          <div className="sc__colSub">Status & notes</div>
        </div>
      </div>

      {/* rows */}
      <div className="sc__rows">
        {scalesDef.map((s) => {
          const cur = value?.[s.id] || { ready: null, note: "" };
          const prev = last?.[s.id] || { ready: null, note: "" };

          const prevStatusClass =
            prev.ready === true
              ? "sc__status--ready"
              : prev.ready === false
                ? "sc__status--notready"
                : "";

          const prevStatusText =
            prev.ready === true
              ? "READY"
              : prev.ready === false
                ? "NOT READY"
                : " ";

          const prevIcon =
            prev.ready === true ? "✓" : prev.ready === false ? "✕" : " ";

          return (
            <div key={s.id} className="sc__row">
              {/* SCALE NAME */}
              <div className="sc__scaleName">{s.label}</div>

              {/* LAST CLASS */}
              <div className="sc__last">
                <div className="sc__lastNote">
                  {prev.note || "Last class note..."}
                </div>

                <div className={`sc__status ${prevStatusClass}`}>
                  <span className="sc__statusIcon">{prevIcon}</span>
                  {prevStatusText}
                </div>
              </div>

              {/* TODAY */}
              <div className="sc__today">
                <label
                  className={`sc__check ${
                    cur.ready ? "sc__check--ready" : "sc__check--notready"
                  }`}
                >
                  <input
                    id={`ready-${s.id}_scales`}
                    name={`ready-${s.id}_scales`}
                    type="checkbox"
                    checked={cur.ready === true}
                    onChange={(e) => onSetReady?.(s.id, e.target.checked)}
                    disabled={disabled}
                  />
                  {cur.ready ? "Ready" : "Not Ready"}
                </label>

                <input
                  id={`note-${s.id}_scales`}
                  name={`note-${s.id}_scales`}
                  className="sc__note"
                  placeholder="Note…"
                  value={cur.note || ""}
                  onChange={(e) => onSetNote?.(s.id, e.target.value)}
                  disabled={disabled}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* readiness section (bottom) */}
      <div className="sc__readiness">
        <div className="sc__readinessTitle">Scales readiness</div>

        <div className="sc__barRow">
          <span className="sc__barLabel">Last week</span>
          <div className="sc__bar">
            <div
              className={`sc__barFill ${lastIsPass ? "sc__fill--pass" : "sc__fill--fail"}`}
              style={{ width: `${lastWeekPercent}%` }}
            />
            <div className="sc__barMarker" />
          </div>
          <span
            className={`sc__barPct ${lastIsPass ? "sc__pct--pass" : "sc__pct--fail"}`}
          >
            {lastWeekPercent}%
          </span>
        </div>

        <div className="sc__barRow">
          <span className="sc__barLabel">After today</span>
          <div className="sc__bar">
            <div
              className={`sc__barFill ${afterIsPass ? "sc__fill--pass" : "sc__fill--fail"}`}
              style={{ width: `${percent}%` }}
            />
            <div className="sc__barMarker" />
          </div>
          <span
            className={`sc__barPct ${afterIsPass ? "sc__pct--pass" : "sc__pct--fail"}`}
          >
            {percent}%
          </span>
        </div>
      </div>
    </article>
  );
}
