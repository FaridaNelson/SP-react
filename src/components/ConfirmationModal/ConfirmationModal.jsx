import { useEffect } from "react";
import "./ConfirmationModal.css";

export default function ConfirmationModal({
  isOpen,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e) => e.key === "Escape" && onCancel?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onCancel?.();
  };

  return (
    <div
      className="confirm-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onMouseDown={handleOverlay}
    >
      <div
        className="confirm-modal__content"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="confirm-modal__title">
          {title}
        </h2>
        <p className="confirm-modal__message">{message}</p>
        <div className="confirm-modal__actions">
          <button
            className="confirm-modal__btn confirm-modal__btn_cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="confirm-modal__btn confirm-modal__btn_danger"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
