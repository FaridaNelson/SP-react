import "./ValidationAlert.css";

export default function ValidationAlert({
  message,
  variant = "error",
  className = "",
}) {
  if (!message) return null;

  const icon = variant === "success" ? "✓" : "⚠️";

  return (
    <div
      className={`validationAlert validationAlert--${variant} ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <span className="validationAlert__icon">{icon}</span>
      <p className="validationAlert__text">{message}</p>
    </div>
  );
}
