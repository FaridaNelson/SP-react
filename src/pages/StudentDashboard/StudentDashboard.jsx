import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import "./StudentDashboard.css";

function displayName(user) {
  return user?.firstName || user?.name || user?.email || "Student";
}

export default function StudentDashboard({ user }) {
  const navigate = useNavigate();

  return (
    <main className="student-dashboard">
      <section
        className="student-dashboard__hero"
        aria-labelledby="student-title"
      >
        <p className="student-dashboard__eyebrow">Student Dashboard</p>
        <h1 id="student-title">Welcome back, {displayName(user)}</h1>
        <p className="student-dashboard__intro">
          Pick up your practice tools and keep building momentum between
          lessons.
        </p>
      </section>

      <section
        className="student-dashboard__section"
        aria-labelledby="student-marketplace-title"
      >
        <div className="student-dashboard__sectionHeader">
          <p className="student-dashboard__eyebrow">Marketplace</p>
          <h2 id="student-marketplace-title">Practice tools</h2>
        </div>

        <button
          type="button"
          className="student-dashboard__toolCard"
          onClick={() => navigate("/student/marketplace/note-detective")}
        >
          <span className="student-dashboard__toolIcon" aria-hidden="true">
            <Search size={24} strokeWidth={2.2} />
          </span>
          <span className="student-dashboard__toolCopy">
            <span className="student-dashboard__toolTitle">Note Detective</span>
            <span className="student-dashboard__toolText">
              A focused note-reading practice space for students.
            </span>
          </span>
        </button>
      </section>
    </main>
  );
}
