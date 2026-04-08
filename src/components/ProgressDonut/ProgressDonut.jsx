import { useEffect, useMemo, useRef, useState } from "react";
import "./ProgressDonut.css";

export default function ProgressDonut({
  value = 0,
  stroke = 9,
  label = "READY",
  passMark = 67,
  showPassMark = true,
  minSize = 80,
  maxSize = 220,
}) {
  const wrapRef = useRef(null);
  const [size, setSize] = useState(160);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setSize(Math.min(maxSize, Math.max(minSize, Math.round(w))));
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [minSize, maxSize]);
  const ringScale = 0.7;
  const radius = ((size - stroke) / 2) * ringScale;
  const circumference = 2 * Math.PI * radius;

  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const progressLen = (clamped / 100) * circumference;

  // NEW: decide tone
  const tone = clamped >= 80 ? "good" : clamped >= passMark ? "mid" : "bad";

  const [dashOffset, setDashOffset] = useState(circumference);
  useEffect(() => {
    setDashOffset(circumference - progressLen);
  }, [circumference, progressLen]);

  const cx = size / 2;
  const cy = size / 2;

  // NEW: tone-specific gradient id
  const gradId = useMemo(
    () => `donutGrad-${Math.random().toString(16).slice(2)}`,
    [],
  );

  // pass tick
  const pm = Math.max(0, Math.min(100, Number(passMark) || 0));
  const pmAngle = (pm / 100) * 2 * Math.PI;
  const cos = Math.cos(pmAngle);
  const sin = Math.sin(pmAngle);

  const tickPad = 2;
  const tickIn = radius - stroke / 2 - tickPad;
  const tickOut = radius + stroke / 2 + tickPad;

  const x1 = cx + tickIn * cos;
  const y1 = cy + tickIn * sin;
  const x2 = cx + tickOut * cos;
  const y2 = cy + tickOut * sin;

  const labelR = radius + stroke / 2 + 12;
  const lx = cx + labelR * cos;
  const ly = cy + labelR * sin;

  return (
    <div
      ref={wrapRef}
      className="donut"
      style={{ width: "100%", height: size }}
    >
      <svg
        className="donut__svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label}: ${clamped}%`}
      >
        <defs>
          {/* Yellow (existing look) */}
          <linearGradient id={`${gradId}-mid`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--gold-light, #e8d49a)" />
            <stop offset="55%" stopColor="var(--gold, #c9a84c)" />
            <stop offset="100%" stopColor="var(--gold-light, #e8d49a)" />
          </linearGradient>

          {/* Green */}
          <linearGradient id={`${gradId}-good`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--green-light, #a7e0b7)" />
            <stop offset="55%" stopColor="var(--green, #4eae6b)" />
            <stop offset="100%" stopColor="var(--green-light, #a7e0b7)" />
          </linearGradient>

          {/* Red */}
          <linearGradient id={`${gradId}-bad`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--red-light, #efb0a2)" />
            <stop offset="55%" stopColor="var(--red, #d07a66)" />
            <stop offset="100%" stopColor="var(--red-light, #efb0a2)" />
          </linearGradient>
        </defs>

        <circle
          className={`donut__track donut__track--${tone}`}
          cx={cx}
          cy={cy}
          r={radius}
          strokeWidth={stroke}
          fill="none"
        />

        <circle
          className="donut__fg"
          cx={cx}
          cy={cy}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          stroke={`url(#${gradId}-${tone})`}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />

        {showPassMark && (
          <>
            <line className="donut__passTick" x1={x1} y1={y1} x2={x2} y2={y2} />
            <text
              className="donut__passText"
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(90 ${lx} ${ly})`}
            >
              {pm}%
            </text>
          </>
        )}
      </svg>

      <div className="donut__center">
        <div className="donut__value">{clamped}%</div>
        <div className="donut__label">{label}</div>
        <div className="tsi__passMark">
          <span className="tsi__passKicker">Ready:</span>
          <span className="tsi__passVal">67%</span>
        </div>
      </div>
    </div>
  );
}
