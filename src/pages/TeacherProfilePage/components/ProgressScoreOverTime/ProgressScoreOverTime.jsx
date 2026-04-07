import "./ProgressScoreOverTime.css";

const PASS_THRESHOLD = 67;
const STRONG_THRESHOLD = 80;

function getPointTone(score) {
  if (score < PASS_THRESHOLD) return "below";
  if (score < STRONG_THRESHOLD) return "pass";
  return "strong";
}

function getY(score, chartHeight, topPad, bottomPad) {
  const usableHeight = chartHeight - topPad - bottomPad;
  return topPad + ((100 - score) / 100) * usableHeight;
}

export default function ProgressScoreOverTime({
  title = "Progress Score Over Time",
  history = [],
  currentScore = null,
}) {
  if (!history.length) {
    return (
      <section className="psot">
        <div className="tsi__sectionTitle">{title}</div>
        <div className="psot__card">
          <div className="psot__empty">No lesson data yet.</div>
        </div>
      </section>
    );
  }

  const width = 1100;
  const height = 290;

  const leftPad = 58;
  const rightPad = 36;
  const topPad = 28;
  const bottomPad = 64;

  const innerWidth = width - leftPad - rightPad;
  const stepX = history.length > 1 ? innerWidth / (history.length - 1) : 0;

  const points = history.map((item, index) => {
    const score = Math.max(
      0,
      Math.min(100, Math.round(Number(item.score) || 0)),
    );
    return {
      ...item,
      score,
      x: leftPad + index * stepX,
      y: getY(score, height, topPad, bottomPad),
      tone: getPointTone(score),
    };
  });

  const yGuides = [100, 83, 67, 50, 33];

  const linePath = points
    .map((p, index) => `${index === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = [
    linePath,
    `L ${points[points.length - 1].x} ${height - bottomPad}`,
    `L ${points[0].x} ${height - bottomPad}`,
    "Z",
  ].join(" ");

  const startScore = points[0]?.score ?? 0;
  const latestScore =
    currentScore != null
      ? Math.round(Number(currentScore) || 0)
      : (points[points.length - 1]?.score ?? 0);

  return (
    <section className="psot">
      <div className="tsi__sectionTitle">{title}</div>

      <div className="psot__card">
        <div className="psot__chartWrap">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="psot__svg"
            role="img"
            aria-label="Progress score over time"
          >
            <defs>
              <linearGradient id="psotAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(122,158,135,0.28)" />
                <stop offset="100%" stopColor="rgba(122,158,135,0.03)" />
              </linearGradient>
            </defs>

            {yGuides.map((value) => {
              const y = getY(value, height, topPad, bottomPad);
              const isPass = value === PASS_THRESHOLD;

              return (
                <g key={value}>
                  <line
                    x1={leftPad}
                    y1={y}
                    x2={width - rightPad}
                    y2={y}
                    className={
                      isPass
                        ? "psot__gridLine psot__gridLine--pass"
                        : "psot__gridLine"
                    }
                  />
                  <text x={leftPad - 10} y={y + 4} className="psot__yLabel">
                    {value}%
                  </text>
                </g>
              );
            })}

            <path d={areaPath} fill="url(#psotAreaGradient)" />
            <path d={linePath} className="psot__line" />

            {points.map((point, index) => (
              <g key={`${point.lessonLabel}-${index}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  className={`psot__point psot__point--${point.tone}`}
                />
                <text
                  x={point.x}
                  y={point.y - 14}
                  textAnchor="middle"
                  className={`psot__pointLabel psot__pointLabel--${point.tone}`}
                >
                  {point.score}%
                </text>
                <text
                  x={point.x}
                  y={height - 34}
                  textAnchor="middle"
                  className="psot__xLabelMain"
                >
                  {point.lessonLabel}
                </text>
                <text
                  x={point.x}
                  y={height - 16}
                  textAnchor="middle"
                  className="psot__xLabelSub"
                >
                  {point.dateLabel}
                </text>
              </g>
            ))}

            <text
              x={width - rightPad + 6}
              y={getY(STRONG_THRESHOLD, height, topPad, bottomPad) + 4}
              className="psot__thresholdLabel psot__thresholdLabel--strong"
            >
              80%
            </text>
            <text
              x={width - rightPad + 6}
              y={getY(PASS_THRESHOLD, height, topPad, bottomPad) + 4}
              className="psot__thresholdLabel psot__thresholdLabel--pass"
            >
              67%
            </text>
          </svg>
        </div>

        <div className="psot__footer">
          <div className="psot__legend">
            <div className="psot__legendItem">
              <span className="psot__legendSwatch psot__legendSwatch--below" />
              <span>&lt;67% (Below threshold)</span>
            </div>
            <div className="psot__legendItem">
              <span className="psot__legendSwatch psot__legendSwatch--pass" />
              <span>67–80% (Pass range)</span>
            </div>
            <div className="psot__legendItem">
              <span className="psot__legendSwatch psot__legendSwatch--strong" />
              <span>&gt;80% (Strong)</span>
            </div>
          </div>

          <div className="psot__summary">
            {history.length} lessons tracked · Current:{" "}
            <span className="psot__summaryValue">{latestScore}%</span> · From{" "}
            {startScore}% start
          </div>
        </div>
      </div>
    </section>
  );
}
