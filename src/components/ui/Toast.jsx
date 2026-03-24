import { useEffect, useState } from "react";
import "./Toast.css";

export default function Toast({ message, variant = "success", onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger enter animation
    const rafId = requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      // wait for exit animation before unmounting
      setTimeout(() => onDone?.(), 250);
    }, 4000);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [onDone]);

  return (
    <div className={`toast toast--${variant} ${visible ? "toast--visible" : ""}`} role="status">
      <span className="toast__icon" aria-hidden="true">
        {variant === "success" && "\u2713"}
        {variant === "error" && "\u2717"}
        {variant === "warning" && "!"}
      </span>
      <span className="toast__message">{message}</span>
    </div>
  );
}
