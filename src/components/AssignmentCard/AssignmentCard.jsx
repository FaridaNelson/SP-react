import "./AssignmentCard.css";

export default function AssignmentCard({ item, title, onClick }) {
  // Normalize props: support either a string title or an object item
  const obj =
    item && typeof item === "object"
      ? item
      : { title: title ?? (typeof item === "string" ? item : "") };

  const handleClick = () => onClick?.(obj);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // prevent page scroll on Space
      handleClick();
    }
  };

  return (
    <article
      className="assignment-card"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={obj.title}
    >
      <h3 className="assignment-card__title">{obj.title}</h3>
      <p className="assignment-card__hint">Click to view details</p>
    </article>
  );
}
