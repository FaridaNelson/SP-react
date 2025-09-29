import "./ProfileSidebar.css";

export default function ProfileSidebar({
  current = [],
  history = [],
  onSelect,
}) {
  const renderList = (items, source) => (
    <ul className="profileNav__list" role="list">
      {items.map((item, i) => {
        // Normalize: support strings or objects
        const obj =
          typeof item === "string"
            ? { key: `s-${source}-${i}`, title: item }
            : item;

        return (
          <li key={obj.key} className="profileNav__item">
            <button
              type="button"
              className="profileNav__link"
              onClick={() => onSelect?.(obj, source)}
            >
              {obj.title}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside className="profileNav" aria-label="Profile sections">
      <div className="profileNav__group">
        <h3 className="profileNav__title">Your Assignment:</h3>
        {renderList(current, "current")}
      </div>

      <div className="profileNav__group">
        <h3 className="profileNav__title">History:</h3>
        {renderList(history, "history")}
      </div>
    </aside>
  );
}
