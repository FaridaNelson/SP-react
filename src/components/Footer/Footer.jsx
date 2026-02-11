import { NavLink } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="sitefooter" role="contentinfo">
      <div className="container sitefooter__row">
        <nav className="sitefooter__nav" aria-label="Footer">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `sitefooter__link ${isActive ? "sitefooter__link--disabled" : ""}`
            }
            onClick={(e) => {
              // prevent navigation only when already on /about
              if (
                e.currentTarget.classList.contains("sitefooter__link--disabled")
              ) {
                e.preventDefault();
              }
            }}
          >
            About
          </NavLink>
        </nav>

        <p className="sitefooter__text">
          Developed by <span className="sitefooter__by">Farida Nelson</span> •{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
