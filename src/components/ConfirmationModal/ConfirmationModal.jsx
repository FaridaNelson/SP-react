import { useEffect } from "react";
import "./ConfirmationModal.css";

export default function ConfirmationModal({
  isOpen,
  title = "Sign Out",
  message = "Are you sure you want to sign out?\nYour progress is saved automatically.",
  confirmText = "Sign out",
  cancelText = "Stay signed in",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (e) => {
      if (e.key === "Escape") onCancel?.();
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) onCancel?.();
  };

  return (
    <div
      className={`confirm-modal__overlay ${isOpen ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        className="confirm-modal__panel"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="confirm-modal__body">
          <div className="confirm-modal__iconWrap" aria-hidden="true">
            <svg
              className="confirm-modal__icon"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>

          <h2 id="confirm-modal-title" className="confirm-modal__title">
            {title}
          </h2>

          <p className="confirm-modal__message">
            {String(message)
              .split("\n")
              .map((line, index) => (
                <span key={index}>
                  {line}
                  {index < String(message).split("\n").length - 1 && <br />}
                </span>
              ))}
          </p>

          <div className="confirm-modal__actions">
            <button
              type="button"
              className="confirm-modal__btn confirm-modal__btn--secondary"
              onClick={onCancel}
            >
              {cancelText}
            </button>

            <button
              type="button"
              className="confirm-modal__btn confirm-modal__btn--danger"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
