import logoUrl from "../../images/StudioPulse-Logo-BW.svg";
import "./Header.css";

export default function Header({ user, onSignIn, onSignUp }) {
  const displayName = user?.name.trim() || "User Name";

  const initials =
    displayName
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "UN";

  return (
    <header className="header">
      <div className="container header__row">
        <a href="/" className="header__brand" aria-label="StudioPulse Home">
          <img src={logoUrl} alt="StudioPulse" className="header__logo" />
        </a>

        <div className="header__user">
          {user ? (
            <div className="header__usersection">
              <span className="header__username">{displayName}</span>
              <div className="header__avatar" aria-hidden="true">
                {initials}
              </div>
            </div>
          ) : (
            <div className="header__navbtns">
              <button
                type="button"
                className="header__authbtn"
                onClick={onSignIn}
              >
                Log In
              </button>
              <button
                type="button"
                className="header__authbtn"
                onClick={onSignUp}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
