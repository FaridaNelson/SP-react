import { Link, useLocation, useNavigate } from "react-router-dom";
import BrandTag from "../BrandTag/BrandTag";
import "./Header.css";

const normalizeRoles = (user) =>
  Array.isArray(user?.roles) ? user.roles : user?.role ? [user.role] : [];

const firstDashboardPath = (user) => {
  const roles = normalizeRoles(user);
  if (roles.includes("admin")) return "/teacher";
  if (roles.includes("teacher")) return "/teacher";
  if (roles.includes("parent")) return "/parent";
  return "/profile";
};

export default function Header({ user, onSignIn, onSignUp, onSignOutRequest }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isHome = pathname === "/";
  const isDashboardRoute = /^(\/profile|\/teacher|\/parent)/.test(pathname);

  const displayName = user?.name?.trim() || "User";

  const initials =
    displayName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "UN";

  const handleUserAction = () => {
    if (!user) return;

    if (isDashboardRoute) {
      onSignOutRequest?.();
      return;
    }

    navigate(firstDashboardPath(user));
  };

  return (
    <header className={`header ${isHome ? "header--home" : "header--app"}`}>
      <div className="container header__row">
        <div className="header__brandWrap">
          <BrandTag compact={!isHome} />
        </div>

        {isHome && (
          <nav className="header__nav" aria-label="Primary">
            <a href="#features" className="header__navLink">
              Features
            </a>
            <a href="#testimonials" className="header__navLink">
              Reviews
            </a>
            <a href="#pricing" className="header__navLink">
              Pricing
            </a>
          </nav>
        )}

        <div className="header__actions">
          {user ? (
            <button
              type="button"
              className="header__userBtn"
              onClick={handleUserAction}
            >
              <span className="header__userText">
                {isDashboardRoute ? "Sign Out" : displayName}
              </span>

              {!isDashboardRoute && (
                <span className="header__avatar" aria-hidden="true">
                  {initials}
                </span>
              )}
            </button>
          ) : (
            <>
              <button
                type="button"
                className="header__signIn"
                onClick={onSignIn}
              >
                Sign In
              </button>

              <button
                type="button"
                className="header__cta"
                onClick={() => onSignUp?.()}
              >
                Start Free Trial
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
