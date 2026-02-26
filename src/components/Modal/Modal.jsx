import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

const ANIM_MS = 220;

export default function Modal({
  open,
  onClose,
  title,
  children,
  panelClassName = "",
  overlayClassName = "",
  variant = "center", // "center" | "slideRight"
}) {
  const panelRef = useRef(null);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  // mount/unmount with animation
  useEffect(() => {
    if (open) {
      setMounted(true);
      // allow initial styles to apply, then animate in
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    // animate out, then unmount
    setVisible(false);
    const t = setTimeout(() => setMounted(false), ANIM_MS);
    return () => clearTimeout(t);
  }, [open]);

  // escape to close (only when mounted)
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  // optional: lock body scroll when modal is mounted
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  if (!mounted) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const overlayCls = [
    "modal",
    variant === "slideRight" ? "modal--slideRight" : "modal--center",
    visible ? "is-open" : "is-closed",
    overlayClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <div className={overlayCls} onClick={handleOverlayClick}>
      <div
        className={`modal__panel ${panelClassName}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        ref={panelRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Only render header if title exists */}
        {title ? (
          <div className="modal__header">
            <h3 id="modal-title" className="modal__title">
              {title}
            </h3>
            <button
              type="button"
              className="modal__close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        ) : null}

        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
