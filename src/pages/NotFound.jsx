import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <section className="notfound" aria-labelledby="nf-title">
      <div
        className="container"
        style={{ textAlign: "center", padding: "64px 0" }}
      >
        <h1
          id="nf-title"
          style={{ margin: 0, fontSize: "clamp(28px,4vw,48px)" }}
        >
          404 — Page not found
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          We couldn't find <code>{pathname}</code>.
        </p>
        <Link
          to="/"
          className="sitefooter__link"
          style={{ display: "inline-block", padding: "8px 12px" }}
        >
          Go home
        </Link>
      </div>
    </section>
  );
}
