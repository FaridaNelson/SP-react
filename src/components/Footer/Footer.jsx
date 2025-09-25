import "./Footer.css";

export default function Footer() {
  return (
    <footer className="sitefooter" role="contentinfo">
      <div className="container sitefooter__row">
        <p className="sitefooter__text">
          Developed by <span className="sitefooter__by">Farida Nelson</span> •{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
