import "./Home.css";
import {
  featureItems,
  skillItems,
  practiceItems,
  testimonialItems,
  pricingItems,
} from "./Home.data";

export default function Home({ onSignUp }) {
  return (
    <main className="sp-home">
      {/* HERO */}
      <section className="sp-hero">
        <div className="sp-hero__container">
          <div className="sp-hero__content">
            <div className="sp-hero__badge">
              ♪ Trusted by Teachers & Families
            </div>

            <h1 className="sp-hero__title">
              The Ultimate Link Between
              <br />
              <em>Teachers, Parents & Students</em>
            </h1>

            <p className="sp-hero__subtitle">
              Streamline ABRSM preparation, track progress efficiently, and
              support student success through direct communication and visual
              progress reports after each lesson.
            </p>

            <div className="sp-hero__buttons">
              <button
                type="button"
                className="sp-btn sp-btn--primary"
                onClick={() => onSignUp?.()}
              >
                Start Your Free Trial
              </button>

              <a href="#features" className="sp-btn sp-btn--secondary">
                See How It Works
              </a>
            </div>

            <div className="sp-hero__stats">
              <div className="sp-stat">
                <div className="sp-stat__number">5,000+</div>
                <div className="sp-stat__label">Teachers & Families</div>
              </div>
              <div className="sp-stat">
                <div className="sp-stat__number">94%</div>
                <div className="sp-stat__label">ABRSM Success Rate</div>
              </div>
              <div className="sp-stat">
                <div className="sp-stat__number">50+</div>
                <div className="sp-stat__label">Countries Worldwide</div>
              </div>
            </div>
          </div>

          <div className="sp-hero__visual">
            <div className="sp-mockup">
              <div className="sp-mockup__screen">
                <div className="sp-exam-card">
                  <div className="sp-exam-card__glow" />

                  <div className="sp-exam-card__inner">
                    <div className="sp-donut-wrap">
                      <svg
                        className="sp-donut-svg"
                        width="110"
                        height="110"
                        viewBox="0 0 110 110"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient
                            id="goldGrad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#E8D49A" />
                            <stop offset="100%" stopColor="#C9A84C" />
                          </linearGradient>
                        </defs>

                        <circle
                          cx="55"
                          cy="55"
                          r="45"
                          fill="none"
                          stroke="rgba(255,255,255,0.07)"
                          strokeWidth="10"
                        />
                        <circle
                          cx="55"
                          cy="55"
                          r="45"
                          fill="none"
                          stroke="url(#goldGrad)"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray="282"
                          strokeDashoffset="73"
                          className="sp-donut-progress"
                        />
                      </svg>

                      <div className="sp-donut-center">
                        <div className="sp-donut-center__pct">74</div>
                        <div className="sp-donut-center__sub">overall</div>
                        <div className="sp-donut-center__pass">ready: 67%</div>
                      </div>
                    </div>

                    <div className="sp-exam-info">
                      <div className="sp-exam-info__label">Grade 4 Exam</div>
                      <div className="sp-exam-info__title">ABRSM Piano</div>

                      <div className="sp-exam-pills">
                        <div className="sp-pill sp-pill--done">
                          Scales & Arpeggios
                        </div>
                        <div className="sp-pill sp-pill--pending">Pieces</div>
                        <div className="sp-pill sp-pill--danger">
                          Sight Reading & Aural
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sp-countdown">
                    <div className="sp-countdown__label">Next lesson</div>
                    <div className="sp-countdown__right">
                      <div className="sp-countdown__date">Wed 3:30pm</div>
                      <div className="sp-countdown__row">
                        <div className="sp-countdown__num">2</div>
                        <div className="sp-countdown__unit">days</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="sp-features">
        <div className="sp-container">
          <div className="sp-section-header">
            <div className="sp-section-badge">
              ✨ Why Teachers & Parents Choose StudioPulse
            </div>
            <h2 className="sp-section-title">How StudioPulse Works</h2>
            <p className="sp-section-subtitle">
              Streamline homework assignments, track ABRSM progress, and support
              student success through seamless collaboration.
            </p>
          </div>

          <div className="sp-features-grid">
            {featureItems.map((item) => (
              <article className="sp-feature-card" key={item.title}>
                <div className={`sp-feature-icon ${item.iconClass}`}>
                  {item.icon}
                </div>
                <h3 className="sp-feature-title">{item.title}</h3>
                <p className="sp-feature-description">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="sp-triangle">
            <h3 className="sp-triangle__title">The Triangle of Success</h3>
            <p className="sp-triangle__subtitle">
              Direct communication between all parties makes ABRSM preparation
              efficient
            </p>
          </div>

          <div className="sp-skills-widget">
            <h3 className="sp-skills-widget__title">Skills Breakdown</h3>

            {skillItems.map((skill) => (
              <div className="sp-skill-row" key={skill.name}>
                <div className="sp-skill-top">
                  <div className="sp-skill-name">{skill.name}</div>
                  <div className="sp-skill-right">
                    <div
                      className={`sp-skill-badge ${
                        skill.fail ? "is-fail" : "is-pass"
                      }`}
                    >
                      {skill.status}
                    </div>
                    <div
                      className={`sp-skill-pct ${
                        skill.fail ? "is-fail" : "is-pass"
                      }`}
                    >
                      {skill.value}
                    </div>
                  </div>
                </div>

                <div className="sp-skill-track">
                  <div
                    className={`sp-skill-fill ${
                      skill.fail ? "is-fail" : "is-pass"
                    }`}
                    style={{ width: `${skill.pct}%` }}
                  />
                  <div className="sp-skill-marker" />
                </div>
              </div>
            ))}

            <div className="sp-skill-footer">
              <div className="sp-skill-marker-label">READY</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRACTICE */}
      <section className="sp-practice">
        <div className="sp-container">
          <div className="sp-section-header">
            <div className="sp-section-badge sp-section-badge--dark">
              🎯 The Power of Consistent Practice
            </div>
            <h2 className="sp-section-title sp-section-title--light">
              Master any skill with the proven
              <br />
              <em>10,000-hour rule</em>
            </h2>
            <p className="sp-section-subtitle sp-section-subtitle--light">
              Small daily commitments lead to extraordinary results. Research
              shows that 10,000 hours of deliberate practice can make you a
              professional in any field.
            </p>
          </div>

          <div className="sp-practice-grid">
            {practiceItems.map((item) => (
              <article
                className={`sp-practice-card ${
                  item.featured ? "sp-practice-card--featured" : ""
                }`}
                key={item.time}
              >
                <div className="sp-practice-time">{item.time}</div>
                <div className="sp-practice-unit">{item.unit}</div>
                <div className="sp-practice-result">{item.result}</div>
                <div className="sp-practice-details">
                  {item.details.map((detail) => (
                    <div key={detail}>{detail}</div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="sp-practice-quote">
            <p>
              "The journey of a thousand miles begins with a single step. Your
              journey to mastery begins with a single practice session."
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="sp-testimonials">
        <div className="sp-container">
          <div className="sp-section-header">
            <div className="sp-section-badge">
              ❤️ Teachers & Parents Love StudioPulse
            </div>
            <h2 className="sp-section-title">What our community is saying</h2>
            <p className="sp-section-subtitle">
              Real experiences from teachers and parents who've seen students
              thrive with StudioPulse.
            </p>
          </div>

          <div className="sp-testimonials-grid">
            {testimonialItems.map((item) => (
              <article className="sp-testimonial-card" key={item.name}>
                <div className="sp-testimonial-rating">★★★★★</div>
                <p className="sp-testimonial-text">"{item.text}"</p>
                <div className="sp-testimonial-author">
                  <div className="sp-author-avatar">{item.initials}</div>
                  <div className="sp-author-info">
                    <h4>{item.name}</h4>
                    <p>{item.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="sp-pricing">
        <div className="sp-container sp-pricing__container">
          <div className="sp-section-header">
            <div className="sp-section-badge">💰 Simple Pricing</div>
            <h2 className="sp-section-title">
              Choose the perfect plan
              <br />
              for your family
            </h2>
            <p className="sp-section-subtitle">
              All plans include progress tracking, teacher communication, and
              practice tools. Start with a 14-day free trial.
            </p>
          </div>

          <div className="sp-pricing-grid">
            {pricingItems.map((item) => (
              <article
                className={`sp-pricing-card ${
                  item.featured ? "sp-pricing-card--featured" : ""
                }`}
                key={item.plan}
              >
                {item.featured && (
                  <div className="sp-pricing-badge">Most Popular</div>
                )}

                <div className="sp-pricing-plan">{item.plan}</div>
                <div className="sp-pricing-price">{item.price}</div>
                <div className="sp-pricing-period">{item.period}</div>

                <ul className="sp-pricing-features">
                  {item.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="sp-pricing-button"
                  onClick={() => onSignUp?.()}
                >
                  Start Free Trial
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
