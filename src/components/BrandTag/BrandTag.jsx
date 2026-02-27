import { Link } from "react-router-dom";

import "./BrandTag.css";

export default function BrandTag({ compact = false }) {
  return (
    <Link
      to="/"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`brand-tag ${compact ? "compact" : ""}`}
    >
      <div className={`brandTag ${compact ? "brandTag--compact" : ""}`}>
        <svg
          className="brandTag__pulse"
          width="68"
          height="19"
          viewBox="0 0 48 16"
          fill="none"
          aria-hidden="true"
        >
          <line x1="0" y1="8" x2="5" y2="8" className="brandTag__line" />
          <polyline
            points="5,8 7.5,8 9,2 11,14 13,4 15,12 17,8 19,8"
            className="brandTag__zig"
            fill="none"
          />
          <line x1="19" y1="8" x2="38" y2="8" className="brandTag__line" />
        </svg>

        <span className="brandTag__text">
          Studio <strong> Pulse</strong>
        </span>
      </div>
    </Link>
  );
}
