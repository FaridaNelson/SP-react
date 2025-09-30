import { Link } from "react-router-dom";
import triangle from "../../images/success-triangle.svg";
import "./About.css";

export default function About({ onOpenSignUp }) {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="container">
        <h2 id="about-title" className="about__title">
          About StudioPulse
        </h2>
        <div className="about__grid">
          <article className="about__card">
            <h3 className="about__heading">Mission</h3>
            <p className="about__text">
              Turn practice into progress by giving music studios a simple,
              structured workflow for assignments, practice logging, and
              feedback—so teachers spend less time managing and more time
              teaching, while students and parents see progress clearly.
            </p>
          </article>
          <article className="about__card">
            <h3 className="about__heading">Vission</h3>
            <p className="about__text">
              StudioPulse is the daily heartbeat of private music study: every
              student knows exactly what to do next, every teacher can assign
              and assess in minutes, and every parent gets a clear, timely
              picture of progress. By uniting structured homework with
              interactive sight-reading (via Soundslice) and lightweight
              assessment, we boost exam readiness and long-term musicianship.
            </p>
          </article>
        </div>
        <div className="about__card container">
          <h2 id="triangle-title" className="about__h2">
            The Triangle of Success
          </h2>

          <div className="about__triangle-body">
            <div className="about__triangle-media">
              <img
                src={triangle}
                className=""
                width={650}
                height={320}
                alt="Triangle showing Student at the top, Parent and Teacher at the base"
                loading="lazy"
              />
            </div>

            <div className="about__triangle-body_text">
              <p className="about__lead">
                The Triangle of Success is the collaboration between{" "}
                <strong>Student</strong>, <strong>Parent</strong>, and{" "}
                <strong>Teacher</strong>. When all three connect, students
                progress faster and stay motivated.
              </p>

              <ul className="about__list">
                <li>
                  <strong>Student</strong>: sets goals, practices with
                  intention, tracks progress.
                </li>
                <li>
                  <strong>Parent</strong>: supports routines, celebrates wins,
                  keeps communication open.
                </li>
                <li>
                  <strong>Teacher</strong>: designs the path, gives feedback,
                  adapts to needs.
                </li>
              </ul>

              <h3 className="about__h3">
                How StudioPulse puts this into action
              </h3>
              <ul className="about__list">
                <li>
                  <strong>Assignments & Practice Logs</strong> — clear tasks;
                  parents can view due dates and completion.
                </li>
                <li>
                  <strong>Progress Insights</strong> — streaks, tempo gains, and
                  repertoire milestones.
                </li>
                <li>
                  <strong>Messaging & Reminders</strong> — everyone stays
                  aligned on goals and performances.
                </li>
              </ul>
            </div>
          </div>

          <div className="sitefooter__nav">
            <Link to="/" className="sitefooter__link">
              Back to Home
            </Link>
            <button
              type="button"
              className="sitefooter__link"
              onClick={() => onOpenSignUp?.()}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
