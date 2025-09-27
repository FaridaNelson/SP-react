import "./ProfileToolbar.css";

export default function ProfileToolbar({ tools = [], onPick }) {
  if (!tools.length) return null;

  return (
    <div className="profileToolbar" role="toolbar" aria-label="Tools">
      <div className="container profileToolbar__inner">
        {tools.map((t) => (
          <button
            key={t}
            type="button"
            className="profileToolbar__btn"
            onClick={() => onPick?.(t)}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
