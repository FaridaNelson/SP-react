import "./PracticeSection.css";
import { useState, useRef, useEffect, useMemo } from "react";

// ─── Task definitions ─────────────────────────────────────────────

const GRADE_TASKS = [
  { id: "pieceA",        label: "Piece A" },
  { id: "pieceB",        label: "Piece B" },
  { id: "pieceC",        label: "Piece C" },
  { id: "scales",        label: "Scales" },
  { id: "sightReading",  label: "Sight Reading" },
  { id: "auralTraining", label: "Aural Training" },
];

const PERF_TASKS = [
  { id: "pieceA", label: "Piece A" },
  { id: "pieceB", label: "Piece B" },
  { id: "pieceC", label: "Piece C" },
  { id: "pieceD", label: "Piece D" },
];

const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Date helpers ─────────────────────────────────────────────────

function dateKey(date) {
  // "YYYY-MM-DD" in local time
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Generate DAYS_BEFORE + 1 + DAYS_AFTER days centered on today
const DAYS_BEFORE = 7;
const DAYS_AFTER  = 7;

function buildDays(today) {
  const days = [];
  for (let i = -DAYS_BEFORE; i <= DAYS_AFTER; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

// ─── Summary theme ────────────────────────────────────────────────

function summaryThemeFor(count) {
  if (count >= 6) return "green";
  if (count >= 4) return "sage";
  if (count >= 2) return "yellow";
  return "rose";
}

// ─── Component ────────────────────────────────────────────────────

export default function PracticeSection({ studentName, examType }) {
  const today      = useMemo(getToday, []);
  const todayKey   = useMemo(() => dateKey(today), [today]);
  const days       = useMemo(() => buildDays(today), [today]);
  const tasks      = examType === "Performance" ? PERF_TASKS : GRADE_TASKS;

  // { "YYYY-MM-DD": { pieceA: true, scales: false, … } }
  const [tasksByDay, setTasksByDay] = useState({});

  const scrollRef  = useRef(null);
  const todayRef   = useRef(null);

  // Scroll to center today on mount
  useEffect(() => {
    const container = scrollRef.current;
    const card      = todayRef.current;
    if (!container || !card) return;
    container.scrollLeft =
      card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2;
  }, []);

  // ── Derived state ─────────────────────────────────────────────

  const isDayPracticed = (key) =>
    Object.values(tasksByDay[key] ?? {}).some(Boolean);

  const practicedCount = useMemo(
    () => days.filter((d) => isDayPracticed(dateKey(d))).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasksByDay, days],
  );

  const summaryTheme = summaryThemeFor(practicedCount);
  const todayTasks   = tasksByDay[todayKey] ?? {};

  // ── Toggle a homework task for today ──────────────────────────

  const toggleTask = (taskId) => {
    setTasksByDay((prev) => {
      const current = prev[todayKey] ?? {};
      return {
        ...prev,
        [todayKey]: { ...current, [taskId]: !current[taskId] },
      };
    });
  };

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="pd-card pd-card--pad">

      {/* Header */}
      <div className="pd-practice-header">
        <div className="pd-practice-title">Practice Record</div>
        <div className="pd-practice-sub">
          Track {studentName}&apos;s practice sessions this week
        </div>
      </div>

      {/* Day carousel — read-only; auto-checks when tasks completed */}
      <div className="pd-carousel" ref={scrollRef}>
        {days.map((d) => {
          const key      = dateKey(d);
          const isToday  = key === todayKey;
          const isFuture = d > today;
          const practiced = isDayPracticed(key);

          const cls = [
            "pd-day-card",
            isToday   && "pd-day-card--today",
            practiced && "pd-day-card--done",
            isFuture  && "pd-day-card--future",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div key={key} ref={isToday ? todayRef : null} className={cls}>
              <div className="pd-day-abbr">{DAY_ABBR[d.getDay()]}</div>
              <div className="pd-day-num">{d.getDate()}</div>
              {practiced && (
                <div className="pd-day-check" aria-label="practiced">✓</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Practice summary — color-coded by days practiced */}
      <div className={`pd-practice-summary pd-practice-summary--${summaryTheme}`}>
        <div className="pd-practice-summary-label">This Week</div>
        <div className="pd-practice-summary-count">{practicedCount} / 7</div>
        <div className="pd-practice-summary-sub">days practiced</div>
      </div>

      {/* Homework task list */}
      <div className="pd-tasklist">
        <div className="pd-tasklist-title">Today's homework</div>
        {tasks.map((task) => {
          const done = !!todayTasks[task.id];
          return (
            <label key={task.id} className="pd-task-item">
              <span className={`pd-task-box${done ? " pd-task-box--done" : ""}`} aria-hidden="true">
                {done && "✓"}
              </span>
              <input
                type="checkbox"
                className="pd-task-input"
                checked={done}
                onChange={() => toggleTask(task.id)}
                aria-label={task.label}
              />
              <span className={`pd-task-label${done ? " pd-task-label--done" : ""}`}>
                {task.label}
              </span>
            </label>
          );
        })}
      </div>

    </div>
  );
}
