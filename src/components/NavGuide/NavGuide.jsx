import { Users, BookOpen, TrendingUp, GraduationCap } from "lucide-react";
import "./NavGuide.css";

export default function NavGuide() {
  return (
    <section className="navguide" aria-labelledby="navguide-title">
      <div className="container">
        <div className="navguide__card">
          <h2 id="navguide-title" className="navguide__title">
            Navigation Guide
          </h2>

          <ul className="navguide__grid" role="list">
            <li className="navguide__item">
              <div className="navguide__icon" aria-hidden="true">
                <Users className="icon-stroke" />
              </div>
              <h3 className="navguide__heading">Dashboard</h3>
              <p className="navguide__text">
                Access your personalized dashboard with all essential
                information at a glance.
              </p>
            </li>

            <li className="navguide__item">
              <div className="navguide__icon" aria-hidden="true">
                <BookOpen className="icon-stroke" />
              </div>
              <h3 className="navguide__heading">Assignments</h3>
              <p className="navguide__text">
                View, create, or complete assignments based on your role in the
                platform.
              </p>
            </li>

            <li className="navguide__item">
              <div className="navguide__icon" aria-hidden="true">
                <TrendingUp className="icon-stroke" />
              </div>
              <h3 className="navguide__heading">Progress</h3>
              <p className="navguide__text">
                Track academic progress with detailed analytics and performance
                metrics.
              </p>
            </li>

            <li className="navguide__item">
              <div className="navguide__icon" aria-hidden="true">
                <GraduationCap className="icon-stroke" />
              </div>
              <h3 className="navguide__heading">Resources</h3>
              <p className="navguide__text">
                Access educational resources, guides, and support materials.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
