import "./AssignmentBreakdown.css";

export default function AssignmentBreakdown({ items = [] }) {
  return (
    <div className="brk">
      {items.map((it) => (
        <div key={it.id} className="brk__row">
          <div className="brk__label">{it.label}</div>
          <div className="brk__barwrap" aria-label={`${it.label} ${it.score}%`}>
            <div
              className="brk__bar"
              style={{ width: `${Math.max(0, Math.min(100, it.score))}%` }}
            />
          </div>
          <div className="brk__val">{Math.round(it.score)}%</div>
        </div>
      ))}
    </div>
  );
}
