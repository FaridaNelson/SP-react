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

  const offset = CIRC - (animated / 100) * CIRC;

  return (
    <div className="pd-donut-wrap">
      <svg className="pd-donut-svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="pdGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8D49A" />
            <stop offset="100%" stopColor="#C9A84C" />
          </linearGradient>
        </defs>
        <circle className="pd-donut-track"    cx="50" cy="50" r="41" />
        <circle
          className="pd-donut-progress"
          cx="50" cy="50" r="41"
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
