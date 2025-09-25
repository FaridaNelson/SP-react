import { Trophy, Clock, Target, Zap } from "lucide-react";
import "./ConsistentPractice.css";

export default function ConsistentPractice() {
  return (
    <section className="practice" aria-labelledby="practice-title">
      <div className="container">
        <header className="practice__intro">
          <h2 id="practice-title" className="practice__title">
            The Power of Consistent Practice
          </h2>
          <p className="practice__lead">
            Master any skill with the proven 10,000-hour rule. Small daily
            commitments lead to extraordinary results.
          </p>
        </header>

        <div
          className="practice__banner"
          role="note"
          aria-label="The 10,000 Hour Rule"
        >
          <Trophy className="icon-stroke practice__trophy" aria-hidden="true" />
          <h3 className="practice__bannerTitle">The 10,000 Hour Rule</h3>
          <p className="practice__bannerText">
            Research shows that 10,000 hours of deliberate practice can make you
            a professional in any field. The key is consistency, not intensity.
            Start today, practice daily, and achieve mastery tomorrow.
          </p>
        </div>

        <ul className="practice__grid" role="list">
          <li className="practice__card">
            <div className="practice__cardIcon" aria-hidden="true">
              <Clock className="icon-stroke" />
            </div>
            <h4 className="practice__cardTitle">20 Minutes Daily</h4>
            <ul className="practice__points">
              <li>
                <strong>10 Years</strong> to Mastery
              </li>
              <li>Just 20 minutes a day</li>
              <li>121 hours per year</li>
              <li>Achievable for everyone</li>
            </ul>
          </li>

          <li className="practice__card">
            <div className="practice__cardIcon" aria-hidden="true">
              <Target className="icon-stroke" />
            </div>
            <h4 className="practice__cardTitle">40 Minutes Daily</h4>
            <ul className="practice__points">
              <li>
                <strong>5 Years</strong> to Mastery
              </li>
              <li>40 minutes a day</li>
              <li>243 hours per year</li>
              <li>Accelerated progress</li>
            </ul>
          </li>

          <li className="practice__card">
            <div className="practice__cardIcon" aria-hidden="true">
              <Zap className="icon-stroke" />
            </div>
            <h4 className="practice__cardTitle">1 Hour Daily</h4>
            <ul className="practice__points">
              <li>
                <strong>3.3 Years</strong> to Mastery
              </li>
              <li>60 minutes a day</li>
              <li>365 hours per year</li>
              <li>Rapid mastery track</li>
            </ul>
          </li>
        </ul>

        <figure className="practice__quote">
          <blockquote>
            “The journey of a thousand miles begins with a single step. Your
            journey to mastery begins with a single practice session.”
          </blockquote>
          <figcaption>
            Start your learning journey with StudioPulse today
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
