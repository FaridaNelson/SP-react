import "./ProfileToolbar.css";

export default function ProfileToolbar({ tools = [], onPick }) {
  return (
    <div className="profileToolbar" role="toolbar" aria-label="Tools">
      <div className="container profileToolbar__inner">
        {tools.map((t, i) => (
          <button
            key={t.key ?? `tool-${i}`}
            type="button"
            className="profileToolbar__btn"
            onClick={() => onPick?.(t)}
          >
            {t.title}
          </button>
        ))}
      </div>
    </div>
  );
}
