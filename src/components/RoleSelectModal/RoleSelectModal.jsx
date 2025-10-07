import Modal from "../../components/Modal/Modal";
import "./RoleSelectModal.css";

const ROLES = [
  {
    id: "student",
    label: "I am a Student",
    desc: "Practice, assignments, progress",
  },
  {
    id: "parent",
    label: "I am a Parent",
    desc: "Check progress & exam readiness",
  },
  {
    id: "teacher",
    label: "I am a Teacher",
    desc: "Assign work & record scores",
  },
];

export default function RoleSelectModal({ open, onClose, onPick }) {
  return (
    <Modal open={open} onClose={onClose} title="Sign up as...">
      <div className="roles">
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            className="roles__card"
            onClick={() => onPick?.(r.id)}
          >
            <div className="roles__label">{r.label}</div>
            <div className="roles__desc">{r.desc}</div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
