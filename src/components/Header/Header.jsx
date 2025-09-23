import logoUrl from "../../images/StudioPulse-Logo-BW.svg";
import "./Header.css";

export default function Header({ user = { name: "User Name" } }) {
  const initials =
    user.name
      .split(/\s+/)
      .slice(0.2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "UN";

  return (
    <header className="header">
      <div className="container header__row">
        <a href="/" className="header__brand" aria-label="StudioPulse Home">
          <img src={logoUrl} alt="StudioPulse" className="header__logo" />
        </a>

        <div className="header__user">
          <span className="header__username">{user.name}</span>
          <div className="header__avatar" aria-hidden="true">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
