import "./Donut.css";
import { useState, useEffect } from "react";
import { PASS_MARK } from "../lib/parentUtils";

export default function Donut({ value }) {
  const [animated, setAnimated] = useState(0);
  const CIRC = 2 * Math.PI * 41; // ≈ 257.6

  useEffect(() => {
    const id = setTimeout(() => setAnimated(value), 80);
    return () => clearTimeout(id);
  }, [value]);

  const clamped = Math.max(0, Math.min(100, value));
  const tone = clamped >= 80 ? "good" : clamped >= PASS_MARK ? "mid" : "bad";
  const offset = CIRC - (animated / 100) * CIRC;

  const fgStroke =
    tone === "bad"  ? "#d4806a" :   // rose — matches --rose token
    tone === "mid"  ? "#c9a84c" :   // gold — matches --gold token
                      "#7a9e87";    // sage — matches --sage token

  return (
    <div className="pd-donut-wrap">
      <svg className="pd-donut-svg" viewBox="0 0 100 100">
        <circle className="pd-donut-track" cx="50" cy="50" r="41" />
        <circle
          className="pd-donut-progress"
          cx="50" cy="50" r="41"
          stroke={fgStroke}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="pd-donut-center">
        <span className="pd-donut-pct">{value}%</span>
        <span className="pd-donut-sub">ready</span>
        <span className="pd-donut-pass-lbl">pass {PASS_MARK}%</span>
      </div>
    </div>
  );
}
