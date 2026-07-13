import { Link } from "react-router-dom";
import "./StudentDashboard.css";

export default function NoteDetectiveHost() {
  return (
    <main className="student-dashboard student-dashboard--centered">
      <section
        className="student-dashboard__placeholder"
        aria-labelledby="note-detective-title"
      >
        <p className="student-dashboard__eyebrow">Marketplace</p>
        <h1 id="note-detective-title">Note Detective</h1>
        <p className="student-dashboard__intro">
          Note Detective is being prepared for this student dashboard.
        </p>
        <Link className="student-dashboard__backLink" to="/student">
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
