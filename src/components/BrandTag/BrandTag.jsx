import "./BrandTag.css";

export default function BrandTag({ compact = false }) {
  return (
    <div className={`brandTag ${compact ? "brandTag--compact" : ""}`}>
      <svg
        className="brandTag__pulse"
        width="38"
        height="16"
        viewBox="0 0 38 16"
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
        Studio<strong>Pulse</strong>
      </span>
    </div>
  );
}
