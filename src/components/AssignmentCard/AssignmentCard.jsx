import "./AssignmentCard.css";

export default function AssignmentCard({ title, onClick }) {
  return (
    <article
      className="assignment-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
    >
      <h3 className="assignment-card__title">{title}</h3>
      <p className="assignment-card__hit">Click to view details</p>
    </article>
  );
}
