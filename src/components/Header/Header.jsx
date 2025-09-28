import { Link, useLocation, useNavigate } from "react-router-dom";
import logoUrl from "../../images/StudioPulse-Logo-BW.svg";
import "./Header.css";

export default function Header({ user, onSignIn, onSignUp, onSignOutRequest }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onProfile = pathname.startsWith("/profile");

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
        <Link to="/" className="header__brand" aria-label="StudioPulse Home">
          <img src={logoUrl} alt="StudioPulse" className="header__logo" />
        </Link>

        <div className="header__user">
          {user ? (
            <button
              type="button"
              className="header__userbtn header__usersection"
              onClick={() => {
                if (onProfile) {
                  onSignOutRequest?.();
                } else {
                  navigate("/profile");
                }
              }}
            >
              <span className="header__username">{displayName}</span>
              <div className="header__avatar" aria-hidden="true">
                {initials}
              </div>
            </button>
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
                onClick={() => {
                  console.log("signUp clicked");
                  onSignUp?.();
                }}
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
