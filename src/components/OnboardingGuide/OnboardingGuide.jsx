import "./OnboardingGuide.css";

export default function OnboardingGuide({ onAddStudent }) {
  return (
    <div className="ob__screen">
      {/* decorative staff lines via CSS ::before */}

      <div className="ob__hero">
        <div className="ob__welcomeRow">
          <span className="ob__welcomeLabel">Welcome to StudioPulse</span>
          <svg
            width="90"
            height="16"
            viewBox="0 0 90 16"
            fill="none"
            style={{ flexShrink: 0, marginBottom: 1 }}
          >
            <line
              x1="0"
              y1="8"
              x2="12"
              y2="8"
              stroke="#C9A84C"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.45"
            />
            <polyline
              points="12,8 16,8 19,2 23,14 27,4 31,12 35,8 43,8"
              stroke="#C9A84C"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <line
              x1="43"
              y1="8"
              x2="90"
              y2="8"
              stroke="#C9A84C"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.45"
            />
          </svg>
        </div>
        <h1 className="ob__title">
          Your ultimate assistant in <em>prep excellence.</em>
        </h1>
        <p className="ob__subtitle">
          Everything you need to guide students to their best performance.
          <br />
          Tracking, grading, homework, and parent communication — all in one
          place.
        </p>
      </div>

      <div className="ob__steps">
        {/* Step 1 */}
        <div className="ob__step">
          <div
            className="ob__arrowLeft"
            onClick={onAddStudent}
            style={{ cursor: "pointer" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Click <strong style={{ margin: "0 3px" }}>＋ Add student</strong> in
            the sidebar
          </div>
        </div>

        {/* Step 2 */}
        <div className="ob__step">
          <div className="ob__stepNum">2</div>
          <div className="ob__stepBody">
            <div className="ob__stepTitle">
              Create a new exam cycle for your student
            </div>
            <div className="ob__stepDesc">
              Set up their ABRSM grade, exam type, repertoire pieces, and target
              date. StudioPulse will track readiness automatically each lesson.
            </div>
            <div className="ob__arrowUp">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              Use <strong style={{ margin: "0 3px" }}>＋ New Exam Cycle</strong>{" "}
              from the student's Progress History
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="ob__step">
          <div className="ob__stepNum">3</div>
          <div className="ob__stepBody">
            <div className="ob__stepTitle">
              Track progress &amp; share results with parents
            </div>
            <div className="ob__stepDesc">
              After each lesson, log grades and set homework. Parents receive a
              clear summary so everyone stays aligned on exam readiness.
            </div>
            <div className="ob__arrowUp">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              Use{" "}
              <strong style={{ margin: "0 3px" }}>✏️ Today's progress</strong>{" "}
              in the top bar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
