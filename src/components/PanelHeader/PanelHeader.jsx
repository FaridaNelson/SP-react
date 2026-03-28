import "./PanelHeader.css";
import "../OnboardingGuide/OnboardingGuide.css"; // for onboarding-specific header styles

export default function PanelHeader({
  displayName,
  subtitle,
  obHoveredStep,
  showActions = true,
  onNewCycle,
  onOpenProgress,
}) {
  console.log("PanelHeader obHoveredStep:", obHoveredStep);
  return (
    <header className="panelHeader">
      <div className="panelHeader__titleWrap">
        <h1 className="panelHeader__title">{displayName}</h1>
        {subtitle && <div className="panelHeader__meta">{subtitle}</div>}
      </div>

      {showActions && (
        <div className="panelHeader__actions">
          <button
            type="button"
            className={`td__pillBtn ${obHoveredStep === 2 ? "ob-btn-flash-topbar" : ""} ${obHoveredStep === 3 ? "ob-topbar-dim" : ""}`}
          >
            ＋ New Exam Cycle
          </button>

          <button
            type="button"
            className={`td__pillBtn ${obHoveredStep === 2 || obHoveredStep === 3 ? "ob-topbar-dim" : ""}`}
          >
            <span className="td__pillIcon">📅</span> Schedule a lesson
          </button>

          <button
            type="button"
            className={`td__pillBtn td__pillBtn--dark ${obHoveredStep === 2 || obHoveredStep === 3 ? "ob-topbar-dim" : ""}`}
          >
            ✉️ Message parent
          </button>

          <button
            type="button"
            className={`td__pillBtn td__pillBtn--gold ${obHoveredStep === 3 ? "ob-btn-flash-progress" : ""} ${obHoveredStep === 2 ? "ob-topbar-dim" : ""}`}
            onClick={onOpenProgress || undefined}
          >
            ✏️ Today's progress
          </button>
        </div>
      )}
    </header>
  );
}
