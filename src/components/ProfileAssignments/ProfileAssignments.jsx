import AssignmentCard from "../AssignmentCard/AssignmentCard";
import "./ProfileAssignments.css";

export default function ProfileAssignments({ title, items = [], onOpen }) {
  return (
    <section className="assignments" aria-labelledby="assignments-title">
      <h2 id="assignments-title" className="assignments__title">
        {title}
      </h2>
      <div className="assignments__grid">
        {items.map((item) => (
          <AssignmentCard
            key={item}
            title={item}
            onClick={() => onOpen?.(item)}
          />
        ))}
      </div>
    </section>
  );
}
