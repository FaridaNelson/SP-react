import "./ProfileSidebar.css";

export default function ProfileSidebar({
  current = [],
  history = [],
  onSelect,
}) {
  return (
    <aside className="profileNav" aria-label="Profile sections">
      <div className="profileNav__group">
        <h3 className="profileNav__title">Your Assignment:</h3>
        <ul className="profileNav__list" role="list">
          {current.map((t) => (
            <li key={t} className="profileNav__item">
              <button
                className="profileNav__link"
                onClick={() => onSelect?.(t, "current")}
              >
                {t}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="profileNav__group">
        <h3 className="profileNav__title">History:</h3>
        <ul className="profileNav__list" role="list">
          {history.map((t) => (
            <li key={t} className="profileNav__item">
              <button
                className="profileNav__link"
                onClick={() => onSelect?.(t, "history")}
              >
                {t}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
