import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import "./ParentProfilePage.css";
import { API_BASE } from "../../lib/api";

const PASS_MARK = 67;

// ─── Data helpers ─────────────────────────────────────────────────

const ELEMENT_META = {
  pieceA: { label: "Piece 1", weight: 20 },
  pieceB: { label: "Piece 2", weight: 20 },
  pieceC: { label: "Piece 3", weight: 20 },
  pieceD: { label: "Piece 4", weight: 20 },
  scales: { label: "Technique & Scales", weight: 14 },
  sightReading: { label: "Sight-Reading", weight: 14 },
  auralTraining: { label: "Aural", weight: 12 },
};

const PERF_ELEMENTS = ["pieceA", "pieceB", "pieceC", "pieceD"];
const GRADE_ELEMENTS = [
  "pieceA",
  "pieceB",
  "pieceC",
  "scales",
  "sightReading",
  "auralTraining",
];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function getDaysToExam(endDate) {
  if (!endDate) return null;
  const diff = Math.ceil((new Date(endDate) - new Date()) / 86400000);
  return diff > 0 ? diff : 0;
}

function formatExamDate(endDate) {
  if (!endDate) return "";
  return new Date(endDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function computeReadiness(items = []) {
  let weighted = 0;
  let totalW = 0;
  items.forEach((item) => {
    const meta = ELEMENT_META[item.elementId];
    if (!meta) return;
    const score = typeof item.score === "number" ? item.score : 0;
    weighted += score * meta.weight;
    totalW += meta.weight;
  });
  return totalW > 0 ? Math.round(weighted / totalW) : 0;
}

function requiredElementsFor(examType) {
  return examType === "Performance" ? PERF_ELEMENTS : GRADE_ELEMENTS;
}

// ─── Donut ────────────────────────────────────────────────────────

function Donut({ value }) {
  const [animated, setAnimated] = useState(0);
  const CIRC = 2 * Math.PI * 41; // ≈ 257.6

  useEffect(() => {
    const id = setTimeout(() => setAnimated(value), 80);
    return () => clearTimeout(id);
  }, [value]);

  const offset = CIRC - (animated / 100) * CIRC;

  return (
    <div className="pd-donut-wrap">
      <svg className="pd-donut-svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="pdGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8D49A" />
            <stop offset="100%" stopColor="#C9A84C" />
          </linearGradient>
        </defs>
        <circle className="pd-donut-track" cx="50" cy="50" r="41" />
        <circle
          className="pd-donut-progress"
          cx="50"
          cy="50"
          r="41"
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="pd-donut-center">
        <span className="pd-donut-pct">{value}%</span>
        <span className="pd-donut-sub">ready</span>
        <span className="pd-donut-pass-lbl">pass {PASS_MARK}%</span>
      </div>
    </div>
  );
}

// ─── Snapshot section ─────────────────────────────────────────────

function SnapshotSection({ student, cycle, items }) {
  const readiness = useMemo(() => computeReadiness(items), [items]);

  const required = requiredElementsFor(cycle?.examType);
  const pills = required.map((id) => {
    const item = items.find((i) => i.elementId === id);
    const score = item?.score ?? null;
    const status = score != null && score >= PASS_MARK ? "done" : "danger";
    return { label: ELEMENT_META[id]?.label ?? id, status };
  });

  const firstRow = pills.slice(0, 3);
  const secondRow = pills.slice(3);

  const gradeLabel = [cycle?.instrument, student?.grade]
    .filter(Boolean)
    .join(" ");

  const daysToExam = getDaysToExam(cycle?.endDate);
  const examDate = formatExamDate(cycle?.endDate);

  const skills = required.map((id) => {
    const item = items.find((i) => i.elementId === id);
    return {
      id,
      label: ELEMENT_META[id]?.label ?? id,
      pct: typeof item?.score === "number" ? Math.round(item.score) : 0,
    };
  });

  return (
    <div>
      {/* Dark exam card */}
      <div className="pd-exam-card">
        <div className="pd-exam-inner">
          {/* Left: donut + date */}
          <div className="pd-exam-left">
            <Donut value={readiness} />
            {examDate && <div className="pd-exam-date">{examDate}</div>}
          </div>

          {/* Centre: grade, title, pills */}
          <div className="pd-exam-info">
            {gradeLabel && <div className="pd-exam-label">{gradeLabel}</div>}
            <div className="pd-exam-title">Spring Exam</div>
            <div className="pd-exam-pills">
              <div className="pd-pills-row">
                {firstRow.map((p, i) => (
                  <span key={i} className={`pd-pill pd-pill--${p.status}`}>
                    {p.status === "done" ? "✓" : "○"} {p.label}
                  </span>
                ))}
              </div>
              {secondRow.length > 0 && (
                <div className="pd-pills-row">
                  {secondRow.map((p, i) => (
                    <span key={i} className={`pd-pill pd-pill--${p.status}`}>
                      {p.status === "done" ? "✓" : "○"} {p.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Countdown footer */}
        {daysToExam != null && (
          <div className="pd-exam-countdown">
            <div className="pd-countdown-right">
              <div className="pd-countdown-row">
                <span className="pd-countdown-num">{daysToExam}</span>
                <span className="pd-countdown-unit">days to go</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Piece progress bars */}
      <div className="pd-section-title">Piece progress</div>
      <div className="pd-card pd-card--pad">
        {skills.map((sk, i) => (
          <div key={sk.id} className="pd-skill-row">
            <div className="pd-skill-top">
              <span className="pd-skill-name">{sk.label}</span>
              <span className="pd-skill-pct">{sk.pct}%</span>
            </div>
            <div className="pd-skill-track">
              <div
                className={`pd-skill-fill ${
                  sk.pct >= PASS_MARK
                    ? "pd-skill-fill--pass"
                    : "pd-skill-fill--fail"
                }`}
                style={{
                  width: `${sk.pct}%`,
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Progress (bar chart) section ─────────────────────────────────

function ProgressSection({ items }) {
  console.log("progress items shape:", items[0]);
  const scores = useMemo(
    () =>
      items
        .filter((item) => item.elementId && typeof item.score === "number")
        //              ↑ add this guard — skips items with no elementId
        .map((item) => ({
          label: ELEMENT_META[item.elementId]?.label ?? item.elementId,
          short: (
            ELEMENT_META[item.elementId]?.label ??
            item.elementId ??
            ""
          ).split(" ")[0],
          //                                                            ↑ fallback to empty string
          score: Math.round(item.score),
        })),
    [items],
  );

  if (!scores.length) {
    return <div className="pd-empty">No score data available yet.</div>;
  }

  const CHART_H = 220;
  const CHART_W = 440;
  const LEFT = 32;
  const RIGHT = 8;
  const BOTTOM = 32;
  const TOP = 12;
  const graphH = CHART_H - BOTTOM - TOP;
  const graphW = CHART_W - LEFT - RIGHT;
  const barW = (graphW - (scores.length - 1) * 6) / scores.length;

  const gridLines = [
    { v: 90, color: "#5A8A6A" },
    { v: 67, color: "#C9A84C" },
  ];

  const colorFor = (pct) =>
    pct >= 90 ? "#5A8A6A" : pct >= PASS_MARK ? "#A8D5BA" : "#D4806A";

  return (
    <div>
      <div className="pd-section-title">Score by element</div>
      <div className="pd-card pd-card--pad">
        <div className="pd-chart-wrap">
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            style={{ width: "100%", maxWidth: CHART_W, height: CHART_H }}
          >
            {gridLines.map((gl) => {
              const y = TOP + graphH - (gl.v * graphH) / 100;
              return (
                <g key={gl.v}>
                  <line
                    x1={LEFT}
                    y1={y}
                    x2={CHART_W - RIGHT}
                    y2={y}
                    stroke={gl.color}
                    strokeWidth="1.5"
                    strokeDasharray="4,3"
                    opacity="0.5"
                  />
                  <text
                    x="2"
                    y={y + 4}
                    fontSize="10"
                    fill={gl.color}
                    fontFamily="DM Sans, sans-serif"
                    fontWeight="600"
                  >
                    {gl.v}%
                  </text>
                </g>
              );
            })}

            {scores.map((s, i) => {
              const x = LEFT + i * (barW + 6);
              const bh = (s.score * graphH) / 100;
              const y = TOP + graphH - bh;
              const c = colorFor(s.score);
              return (
                <g key={s.label}>
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={bh}
                    fill={c}
                    rx="3"
                    ry="3"
                  />
                  <text
                    x={x + barW / 2}
                    y={y - 5}
                    fontSize="10"
                    fill={c}
                    textAnchor="middle"
                    fontFamily="DM Sans, sans-serif"
                    fontWeight="600"
                  >
                    {s.score}%
                  </text>
                  <text
                    x={x + barW / 2}
                    y={CHART_H - 10}
                    fontSize="9"
                    fill={c}
                    textAnchor="middle"
                    fontFamily="DM Sans, sans-serif"
                    fontWeight="500"
                  >
                    {s.short}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Practice section ─────────────────────────────────────────────

function PracticeSection({ studentName, record, onToggle }) {
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const completed = record.filter(Boolean).length;

  return (
    <div className="pd-card pd-card--pad">
      <div className="pd-practice-header">
        <div className="pd-practice-title">Practice Record</div>
        <div className="pd-practice-sub">
          Track {studentName}&apos;s practice sessions this week
        </div>
      </div>

      <div className="pd-practice-week">
        {DAYS.map((day, i) => (
          <div
            key={day}
            className={`pd-practice-day${record[i] ? " pd-practice-day--done" : ""}`}
            onClick={() => onToggle(i)}
            role="button"
            aria-label={`${day} — ${record[i] ? "practiced" : "not practiced"}`}
          >
            <div className="pd-practice-day-name">{day}</div>
            <div className="pd-practice-day-icon">{record[i] ? "✓" : "○"}</div>
          </div>
        ))}
      </div>

      <div className="pd-practice-summary">
        <div className="pd-practice-summary-label">This Week</div>
        <div className="pd-practice-summary-count">{completed} / 7</div>
        <div className="pd-practice-summary-sub">days practiced</div>
      </div>
    </div>
  );
}

// ─── Profile page ─────────────────────────────────────────────────

function ProfilePage({ user, onBack, onSignOut }) {
  return (
    <div className="pd-profile">
      <button className="pd-back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="pd-profile-header">
        <div className="pd-parent-avatar pd-parent-avatar--lg">
          {getInitials(user?.name ?? "Parent")}
        </div>
        <div className="pd-profile-name">{user?.name ?? "Parent"}</div>
        <div className="pd-profile-email">{user?.email ?? ""}</div>
      </div>

      <div className="pd-settings-section">
        <div className="pd-settings-title">Account Settings</div>
        <div className="pd-settings-item">
          <span className="pd-settings-label">Email</span>
          <span className="pd-settings-value">{user?.email ?? "—"}</span>
        </div>
        <div className="pd-settings-item">
          <span className="pd-settings-label">Phone</span>
          <span className="pd-settings-value">{user?.phone || "Not set"}</span>
        </div>
        <div className="pd-settings-item">
          <span className="pd-settings-label">Password</span>
          <span className="pd-settings-value">••••••••</span>
        </div>
      </div>

      <div className="pd-settings-section">
        <div className="pd-settings-title">Preferences</div>
        <div className="pd-settings-item">
          <span className="pd-settings-label">Email Notifications</span>
          <span className="pd-settings-value">Enabled</span>
        </div>
        <div className="pd-settings-item">
          <span className="pd-settings-label">Language</span>
          <span className="pd-settings-value">English</span>
        </div>
      </div>

      <button className="pd-signout-btn" onClick={onSignOut}>
        Sign Out
      </button>
    </div>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────

function TopBar({ students, selectedId, onSelect, onProfileClick, user }) {
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);
  const selected = students.find((s) => s._id === selectedId);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="pd-topbar">
      {/* Logo */}
      <div className="pd-topbar-logo">
        <svg width="32" height="14" viewBox="0 0 38 16" fill="none">
          <line
            x1="0"
            y1="8"
            x2="5"
            y2="8"
            stroke="#E8D49A"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          <polyline
            points="5,8 7.5,8 9,2 11,14 13,4 15,12 17,8 19,8"
            stroke="#E8D49A"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <line
            x1="19"
            y1="8"
            x2="38"
            y2="8"
            stroke="#E8D49A"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
        <span className="pd-topbar-wordmark">
          STUDIO <strong>PULSE</strong>
        </span>
      </div>

      {/* Right controls */}
      <div className="pd-topbar-right">
        {/* Child selector */}
        <div className="pd-child-selector" ref={dropRef}>
          <button className="pd-child-btn" onClick={() => setOpen((o) => !o)}>
            {selected && (
              <span className="pd-child-avatar">
                {getInitials(selected.name)}
              </span>
            )}
            <span>{selected?.firstName ?? "Select child"}</span>
            <span className="pd-child-caret">▾</span>
          </button>

          {open && (
            <div className="pd-child-dropdown">
              {students.map((s) => (
                <div
                  key={s._id}
                  className={`pd-dropdown-item${
                    s._id === selectedId ? " pd-dropdown-item--active" : ""
                  }`}
                  onClick={() => {
                    onSelect(s._id);
                    setOpen(false);
                  }}
                >
                  <span className="pd-child-avatar pd-child-avatar--sm">
                    {getInitials(s.name)}
                  </span>
                  <div>
                    <div className="pd-dropdown-name">{s.name}</div>
                    <div className="pd-dropdown-grade">{s.grade ?? ""}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Parent avatar */}
        <button className="pd-profile-btn" onClick={onProfileClick}>
          <div className="pd-parent-avatar">
            {getInitials(user?.name ?? "P")}
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    id: "snapshot",
    label: "Snapshot",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "progress",
    label: "Progress",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "practice",
    label: "Practice",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: "detailed",
    label: "Detailed",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: "exams",
    label: "Exams",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

function BottomNav({ active, onChange }) {
  return (
    <div className="pd-bottom-nav">
      {NAV_ITEMS.map((item) => (
        <div
          key={item.id}
          className={`pd-nav-item${active === item.id ? " pd-nav-item--active" : ""}`}
          onClick={() => onChange(item.id)}
          role="button"
          aria-label={item.label}
        >
          <div className="pd-nav-icon">{item.icon}</div>
          <div className="pd-nav-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────

export default function ParentDashboard({ currentUser }) {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [activeSection, setActiveSection] = useState("snapshot");
  const [showProfile, setShowProfile] = useState(false);
  const [practiceRecord, setPracticeRecord] = useState(Array(7).fill(false));
  const [error, setError] = useState(null);

  // ── Fetch children ──────────────────────────────────────────────
  useEffect(() => {
    setLoadingStudents(true);
    fetch(`${API_BASE}/api/parent/students`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then(({ students: list }) => {
        setStudents(list ?? []);
        if (list?.length) setSelectedId(list[0]._id);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingStudents(false));
  }, []);

  // ── Fetch progress for selected child ──────────────────────────
  useEffect(() => {
    if (!selectedId) return;
    setLoadingItems(true);
    fetch(`${API_BASE}/api/parent/students/${selectedId}/progress`, {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then(({ items: list }) => setItems(list ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingItems(false));
  }, [selectedId]);

  // ── Toggle practice day ─────────────────────────────────────────
  const toggleDay = useCallback((i) => {
    setPracticeRecord((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }, []);

  // ── Derived ─────────────────────────────────────────────────────
  const selectedStudent = students.find((s) => s._id === selectedId);
  const cycle = selectedStudent?.activeExamCycleId ?? null;

  // ── No student linked ───────────────────────────────────────────
  if (!loadingStudents && !students.length) {
    return (
      <main className="pd-container pd-container--empty">
        <div className="pd-topbar pd-topbar--simple">
          <div className="pd-topbar-logo">
            <span className="pd-topbar-wordmark">
              STUDIO <strong>PULSE</strong>
            </span>
          </div>
        </div>
        <div className="pd-empty-state">
          <h1 className="pd-empty-title">Student Progress</h1>
          <p className="pd-empty-body">
            To view progress, link your student ID — ask their teacher.
          </p>
        </div>
      </main>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────
  if (loadingStudents) {
    return (
      <main className="pd-container">
        <div className="pd-loading">Loading…</div>
      </main>
    );
  }

  // ── Main render ─────────────────────────────────────────────────
  return (
    <div className="pd-root">
      <TopBar
        students={students}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onProfileClick={() => setShowProfile(true)}
        user={currentUser}
      />

      {showProfile ? (
        <div className="pd-content">
          <ProfilePage
            user={currentUser}
            onBack={() => setShowProfile(false)}
            onSignOut={() => {
              /* wire to your auth context */
            }}
          />
        </div>
      ) : (
        <>
          <div className="pd-content">
            {error && (
              <div className="pd-error">
                Something went wrong loading data. Please refresh.
              </div>
            )}

            {loadingItems ? (
              <div className="pd-loading">Loading…</div>
            ) : (
              <>
                {/* Snapshot */}
                {activeSection === "snapshot" && (
                  <SnapshotSection
                    student={selectedStudent}
                    cycle={cycle}
                    items={items}
                  />
                )}

                {/* Progress */}
                {activeSection === "progress" && (
                  <ProgressSection items={items} />
                )}

                {/* Practice */}
                {activeSection === "practice" && (
                  <PracticeSection
                    studentName={selectedStudent?.firstName ?? "your child"}
                    record={practiceRecord}
                    onToggle={toggleDay}
                  />
                )}

                {/* Detailed — coming soon */}
                {activeSection === "detailed" && (
                  <div className="pd-card pd-card--pad">
                    <div className="pd-coming-soon">
                      <div className="pd-coming-soon-icon" aria-hidden="true">
                        ♩
                      </div>
                      <div className="pd-coming-soon-text">
                        Pieces overview coming soon…
                      </div>
                    </div>
                  </div>
                )}

                {/* Exams — coming soon */}
                {activeSection === "exams" && (
                  <div className="pd-card pd-card--pad">
                    <div className="pd-coming-soon">
                      <div className="pd-coming-soon-icon" aria-hidden="true">
                        ◎
                      </div>
                      <div className="pd-coming-soon-text">
                        Exam management coming soon…
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <BottomNav active={activeSection} onChange={setActiveSection} />
        </>
      )}
    </div>
  );
}
