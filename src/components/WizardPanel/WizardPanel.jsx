import "./WizardPanel.css";

export default function WizardPanel({
  stepCount,
  currentStep,
  children,
  footer,
  error,
}) {
  return (
    <div className="wp__panel">
      <div className="wp__steps">
        {Array.from({ length: stepCount }).map((_, i) => (
          <div
            key={i}
            className={`wp__step${i === currentStep ? " wp__step--active" : ""}${i < currentStep ? " wp__step--done" : ""}`}
          />
        ))}
      </div>

      <div className="wp__content">{children}</div>

      {error && <p className="wp__error">{error}</p>}

      <div className="wp__footer">{footer}</div>
    </div>
  );
}
