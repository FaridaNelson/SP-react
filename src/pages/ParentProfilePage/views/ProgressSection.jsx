import "./ProgressSection.css";
import { useState, useEffect } from "react";
import { API_BASE } from "../../../lib/api";

const PASS_MARK = 67;
const STRONG_MARK = 80;
const EXCELLENT_MARK = 90;

function barColor(score) {
  if (score >= EXCELLENT_MARK) return "var(--sage, #7a9e87)";
  if (score >= STRONG_MARK) return "var(--sage, #7a9e87)";
  if (score >= PASS_MARK) return "var(--gold, #c9a84c)";
  return "var(--rose, #d4806a)";
}

// ─── Bar chart (mirrors ExamCycleCard ReadinessSparkline, scaled up) ──

function ProgressBarChart({ history }) {
  if (!history.length) {
    return <div className="ps-empty">No lesson data yet.</div>;
  }

  const CHART_H = 200;
  const CHART_W = 440;
  const LEFT = 36;
  const RIGHT = 8;
  const BOTTOM = 36;
  const TOP = 16;
  const GRAPH_H = CHART_H - BOTTOM - TOP;
  const GRAPH_W = CHART_W - LEFT - RIGHT;
  const barW = Math.min(
    32,
    (GRAPH_W - (history.length - 1) * 6) / history.length,
  );
  const step = history.length > 1 ? (GRAPH_W - barW) / (history.length - 1) : 0;

  const yOf = (pct) => TOP + GRAPH_H - (pct / 100) * GRAPH_H;

  const thresholds = [
    { v: EXCELLENT_MARK, color: "#2d6b48", label: "90%" },
    { v: STRONG_MARK, color: "var(--sage,#7a9e87)", label: "80%" },
    { v: PASS_MARK, color: "var(--gold,#c9a84c)", label: "67%" },
  ];

  return (
    <div className="ps-chart-wrap">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        style={{ width: "100%", maxWidth: CHART_W, height: CHART_H }}
      >
        {/* Threshold lines */}
        {thresholds.map((t) => {
          const y = yOf(t.v);
          return (
            <g key={t.v}>
              <line
                x1={LEFT}
                y1={y}
                x2={CHART_W - RIGHT}
                y2={y}
                stroke={t.color}
                strokeWidth="1.5"
                strokeDasharray={t.v === PASS_MARK ? "4 3" : "4 3"}
                opacity="0.55"
              />
              <text
                x="2"
                y={y + 4}
                fontSize="10"
                fill={t.color}
                fontFamily="DM Sans, sans-serif"
                fontWeight="600"
              >
                {t.label}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {history.map((pt, i) => {
          const x = LEFT + i * (barW + step / (history.length - 1 || 1));
          const bh = Math.max(2, (pt.score / 100) * GRAPH_H);
          const y = TOP + GRAPH_H - bh;
          const c = barColor(pt.score);

          // Distribute bars evenly
          const xPos =
            LEFT + i * ((GRAPH_W - barW) / Math.max(1, history.length - 1));

          return (
            <g key={pt.lessonLabel}>
              <rect
                x={xPos}
                y={y}
                width={barW}
                height={bh}
                fill={c}
                rx="3"
                ry="3"
              />
              <text
                x={xPos + barW / 2}
                y={y - 6}
                fontSize="9"
                fill={c}
                textAnchor="middle"
                fontFamily="DM Sans, sans-serif"
                fontWeight="700"
              >
                {pt.score}%
              </text>
              <text
                x={xPos + barW / 2}
                y={CHART_H - 18}
                fontSize="9"
                fill="#888"
                textAnchor="middle"
                fontFamily="DM Sans, sans-serif"
                fontWeight="600"
              >
                {pt.lessonLabel}
              </text>
              <text
                x={xPos + barW / 2}
                y={CHART_H - 6}
                fontSize="8"
                fill="#bbb"
                textAnchor="middle"
                fontFamily="DM Sans, sans-serif"
              >
                {pt.dateLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────

function Legend() {
  const items = [
    { color: "var(--rose,#d4806a)", label: "<67% (Below)" },
    { color: "var(--gold,#c9a84c)", label: "67–79% (Ready)" },
    { color: "var(--sage,#7a9e87)", label: "80%+ (Strong)" },
    { color: "var(--sage,#2d6b48)", label: "90%+ (Excellent)" },
  ];
  return (
    <div className="ps-legend">
      {items.map((it) => (
        <div key={it.label} className="ps-legend-item">
          <span className="ps-legend-dot" style={{ background: it.color }} />
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────

export default function ProgressSection({ studentId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/parent/students/${studentId}/progress/history`, {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then(({ history: list }) => setHistory(list ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <div className="pd-loading">Loading…</div>;

  if (error) {
    return (
      <div className="pd-error">
        Could not load progress history. Please refresh.
      </div>
    );
  }

  const latest = history[history.length - 1]?.score ?? null;
  const first = history[0]?.score ?? null;
  const gain = latest != null && first != null ? latest - first : null;

  return (
    <div>
      <div className="pd-section-title">Total score over time</div>
      <div className="pd-card pd-card--pad">
        <ProgressBarChart history={history} />

        {history.length > 0 && (
          <div className="ps-footer">
            <Legend />
            <div className="ps-summary">
              {history.length} lesson{history.length !== 1 ? "s" : ""} tracked
              {latest != null && (
                <>
                  {" "}
                  · Current:{" "}
                  <span
                    className="ps-summary-score"
                    style={{ color: barColor(latest) }}
                  >
                    {latest}%
                  </span>
                </>
              )}
              {gain != null && gain !== 0 && (
                <>
                  {" "}
                  · {gain > 0 ? "+" : ""}
                  {gain}% since start
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
