import "./ProgressDonut.css";

export default function ProgressDonut({
  value = 0,
  size = 220,
  stroke = 18,
  label = "Readiness",
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (clamped / 100) * circumference;

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="donut" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label}: ${clamped}%`}
      >
        {/* Optional track (background ring) */}
        <circle
          className="donut__track"
          cx={cx}
          cy={cy}
          r={radius}
          strokeWidth={stroke}
          fill="none"
        />

        {/* Foreground progress */}
        <circle
          className="donut__fg"
          cx={cx}
          cy={cy}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset="0"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>

      <div className="donut__center">
        <div className="donut__value">{clamped}%</div>
        <div className="donut__label">{label}</div>
      </div>
    </div>
  );
}
