import "./About.css";

export default function About() {
  return (
    <section id="about" className="about" aria-labeledby="about-title">
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
      </div>
    </section>
  );
}
