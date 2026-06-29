import "./PracticeSection.css";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { API_BASE } from "../../../lib/api";

// ─── Task definitions ─────────────────────────────────────────────

const GRADE_TASKS = [
  { id: "pieceA", label: "Piece A" },
  { id: "pieceB", label: "Piece B" },
  { id: "pieceC", label: "Piece C" },
  { id: "scales", label: "Scales" },
  { id: "sightReading", label: "Sight Reading" },
  { id: "auralTraining", label: "Aural Training" },
];

const PERF_TASKS = [
  { id: "pieceA", label: "Piece A" },
  { id: "pieceB", label: "Piece B" },
  { id: "pieceC", label: "Piece C" },
  { id: "pieceD", label: "Piece D" },
];

// const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Date helpers ─────────────────────────────────────────────────

function dateKey(date) {
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

// function buildWeek(today) {
//   const sunday = new Date(today);
//   sunday.setDate(today.getDate() - today.getDay()); // rewind to Sunday
//   return Array.from({ length: 7 }, (_, i) => {
//     const d = new Date(sunday);
//     d.setDate(sunday.getDate() + i);
//     return d;
//   });
// }

// function summaryThemeFor(count) {
//   if (count >= 6) return "green";
//   if (count >= 4) return "sage";
//   if (count >= 2) return "yellow";
//   return "rose";
// }

function formatPracticeDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
}

function isSameDay(a, b) {
  return dateKey(a) === dateKey(b);
}

const MOCK_ASSIGNMENTS = [
  {
    id: "pieceA",
    pill: "Piece A",
    name: "Sonatina in G — Clementi",
    homework: "Hands separate, bars 1–20. Even left-hand quavers. 10 min/day.",
  },
  {
    id: "pieceB",
    pill: "Piece B",
    name: "Arabesque — Burgmüller",
    homework: "Slow practice for the semiquaver runs. Metronome at 60.",
  },
  {
    id: "pieceC",
    pill: "Piece C",
    name: "Romance — Schumann",
    homework: "",
  },
  {
    id: "scales",
    pill: "Technique",
    name: "Scales & Arpeggios",
    homework: "G, D and A major — two octaves, hands together.",
  },
  {
    id: "sightReading",
    pill: "Sight-read",
    name: "",
    homework: "One new 4-bar example daily, workbook p.12–14.",
  },
];

// Csrf token helper:
async function getCsrfToken() {
  const res = await fetch(`${API_BASE}/api/csrf-token`, {
    credentials: "include",
  });
  const data = await res.json();
  return data.csrfToken;
}

function createEmptyTaskRecord(existing = {}) {
  return {
    status: "notCovered",
    minutes: Number.isFinite(Number(existing.minutes))
      ? Number(existing.minutes)
      : 0,
    taskOutcome: "none",
    note: typeof existing.note === "string" ? existing.note : "",
  };
}

function createPracticedTaskRecord(existing = {}) {
  return {
    status: "practiced",
    minutes: Number.isFinite(Number(existing.minutes))
      ? Number(existing.minutes)
      : 0,
    taskOutcome: ["none", "inProgress", "needsHelp"].includes(
      existing.taskOutcome,
    )
      ? existing.taskOutcome
      : "none",
    note: typeof existing.note === "string" ? existing.note : "",
  };
}

function isTaskPracticed(taskRecord) {
  return taskRecord?.status === "practiced";
}

function normalizeTasksByDayForSave(snapshot, tasks) {
  const result = {};

  for (const [dayKey, dayTasks] of Object.entries(snapshot)) {
    result[dayKey] = {};

    for (const task of tasks) {
      const taskRecord = dayTasks[task.id];

      result[dayKey][task.id] = isTaskPracticed(taskRecord)
        ? createPracticedTaskRecord(taskRecord)
        : createEmptyTaskRecord(taskRecord);
    }
  }

  return result;
}

function normalizeTasksByDayFromServer(serverTasksByDay) {
  const result = {};

  for (const [dayKey, dayTasks] of Object.entries(serverTasksByDay || {})) {
    result[dayKey] = {};

    for (const [taskId, taskData] of Object.entries(dayTasks || {})) {
      if (taskData === true) {
        result[dayKey][taskId] = createPracticedTaskRecord();
      } else if (taskData?.status === "practiced") {
        result[dayKey][taskId] = createPracticedTaskRecord(taskData);
      } else {
        result[dayKey][taskId] = createEmptyTaskRecord();
      }
    }
  }

  return result;
}

// ─── Component ────────────────────────────────────────────────────

export default function PracticeSection({
  // studentName,
  examType,
  studentId,
  cycle,
  saveRef,
}) {
  const today = useMemo(getToday, []);

  const tasks = useMemo(
    () => (examType === "Performance" ? PERF_TASKS : GRADE_TASKS),
    [examType],
  );

  // const todayKey = useMemo(() => dateKey(today), [today]);
  // const days = useMemo(() => buildWeek(today), [today]);

  // { "YYYY-MM-DD": { pieceA: { status, minutes, taskOutcome, note }, ... } }
  const [tasksByDay, setTasksByDay] = useState({});

  const [selectedDate] = useState(today);

  const selectedDateKey = useMemo(() => dateKey(selectedDate), [selectedDate]);

  const selectedDayTasks = tasksByDay[selectedDateKey] || {};

  const dailyTotal = useMemo(() => {
    const dayTasks = tasksByDay[selectedDateKey] ?? {};

    return Object.values(dayTasks).reduce(
      (sum, task) => sum + (Number(task?.minutes) || 0),
      0,
    );
  }, [tasksByDay, selectedDateKey]);
  // Keep a ref to latest tasksByDay for the unmount save
  const [savePracticeLogStatus, setSavePracticeLogStatus] = useState("idle"); // "idle" | "saving" | "saved" | "error"

  // Keep a ref to latest tasksByDay for the unmount save
  const tasksByDayRef = useRef(tasksByDay);
  useEffect(() => {
    tasksByDayRef.current = tasksByDay;
  }, [tasksByDay]);

  const savePracticeLog = useCallback(async () => {
    const snapshot = tasksByDayRef.current;
    if (!studentId || !cycle?._id) return;

    setSavePracticeLogStatus("saving");

    const homeworkTaskList = {};

    tasks.forEach((task) => {
      const practicedEntries = Object.entries(snapshot).filter(([, dayTasks]) =>
        isTaskPracticed(dayTasks[task.id]),
      );

      const dates = practicedEntries.map(([date]) => date).sort();
      const daysPracticed = dates.length;

      let streak = 0;
      if (dates.length > 0) {
        streak = 1;
        for (let i = dates.length - 1; i > 0; i--) {
          const diff = (new Date(dates[i]) - new Date(dates[i - 1])) / 86400000;
          if (diff === 1) streak++;
          else break;
        }
      }

      homeworkTaskList[task.id] = {
        daysPracticed,
        streak,
        lastPracticedDate: dates[dates.length - 1] ?? null,
        totalMinutes: 0,
      };
    });

    const totalDaysPracticed = Object.values(snapshot).filter((dayTasks) =>
      Object.values(dayTasks).some(isTaskPracticed),
    ).length;

    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());

    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);

    const weekStartDate = dateKey(sunday);
    const weekEndDate = dateKey(saturday);

    const tasksByDayForSave = normalizeTasksByDayForSave(snapshot, tasks);

    try {
      const csrfToken = await getCsrfToken();

      const res = await fetch(
        `${API_BASE}/api/parent/students/${studentId}/practice-log`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify({
            examCycleId: cycle._id,
            weekStartDate,
            weekEndDate,
            homeworkTaskList,
            totalDaysPracticed,
            tasksByDay: tasksByDayForSave,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Practice log save failed");
      }

      setSavePracticeLogStatus("saved");
    } catch (error) {
      console.error("Failed to save practice log:", error);
      setSavePracticeLogStatus("error");
    }
  }, [studentId, cycle?._id, tasks, today]);

  useEffect(() => {
    async function loadPracticeLog() {
      if (!studentId || !cycle?._id) return;

      const sunday = new Date(today);
      sunday.setDate(today.getDate() - today.getDay());

      const weekStartDate = dateKey(sunday);

      try {
        const res = await fetch(
          `${API_BASE}/api/parent/students/${studentId}/practice-log?examCycleId=${cycle._id}&weekStartDate=${weekStartDate}`,
          { credentials: "include" },
        );

        if (!res.ok) return;

        const data = await res.json();

        if (data.practiceLog?.tasksByDay) {
          setTasksByDay(
            normalizeTasksByDayFromServer(data.practiceLog.tasksByDay),
          );
        }
      } catch (error) {
        console.error("Failed to load practice log:", error);
      }
    }

    loadPracticeLog();
  }, [studentId, cycle?._id, today]);

  // ── Expose save function via ref for parent to call on navigate-away ──
  useEffect(() => {
    if (!saveRef) return;
    saveRef.current = savePracticeLog;
  }, [saveRef, savePracticeLog]);

  // ── Single source of truth: which days have any task done ─────
  // Derived directly from tasksByDay — no closures, no stale reads.
  //
  // const practicedDays = useMemo(() => {
  //   const set = new Set();
  //   for (const [day, dayTasks] of Object.entries(tasksByDay)) {
  //     if (Object.values(dayTasks).some(isTaskPracticed)) set.add(day);
  //   }
  //   return set;
  // }, [tasksByDay]);

  // const practicedCount = useMemo(
  //   () => days.filter((d) => practicedDays.has(dateKey(d))).length,
  //   [days, practicedDays],
  // );

  // const summaryTheme = summaryThemeFor(practicedCount);

  // ── Toggle a task for any day ───────────────────────────────────
  // const toggleTaskForDay = useCallback((dayKey, taskId) => {
  //   setSavePracticeLogStatus("idle");

  //   setTasksByDay((prev) => {
  //     const current = prev[dayKey] ?? {};
  //     const currentTask = current[taskId];
  //     const currentlyPracticed = isTaskPracticed(currentTask);

  //     return {
  //       ...prev,
  //       [dayKey]: {
  //         ...current,
  //         [taskId]: currentlyPracticed
  //           ? createEmptyTaskRecord(currentTask)
  //           : createPracticedTaskRecord(currentTask),
  //       },
  //     };
  //   });
  // }, []);

  // const updateTaskMinutes = useCallback((dayKey, taskId, value) => {
  //   const minutes = Math.max(0, Math.min(300, Number(value) || 0));

  //   setSavePracticeLogStatus("idle");

  //   setTasksByDay((prev) => {
  //     const current = prev[dayKey] ?? {};
  //     const currentTask = current[taskId] ?? createPracticedTaskRecord();

  //     return {
  //       ...prev,
  //       [dayKey]: {
  //         ...current,
  //         [taskId]: {
  //           ...createPracticedTaskRecord(currentTask),
  //           minutes,
  //         },
  //       },
  //     };
  //   });
  // }, []);

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="pd-card pd-card--pad">
      <div className="pd-practice-date-bar">
        <button type="button" className="pd-practice-date-btn">
          <div className="pd-practice-date-left">
            <div className="pd-practice-date-icon">
              {" "}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>

            <div className="pd-practice-date-texts">
              <span className="pd-practice-date-label">Practice day</span>
              <span className="pd-practice-date-value">
                {formatPracticeDate(selectedDate)}
                {isSameDay(selectedDate, today) && (
                  <span className="pd-practice-today-tag">Today</span>
                )}
              </span>
            </div>
          </div>

          <span className="pd-practice-date-chevron">⌄</span>
        </button>
      </div>

      <div className="pd-practice-section-title">Today&apos;s practice</div>

      <div className="pd-practice-total-card">
        <span className="pd-practice-total-label">Total practiced today</span>
        <span className="pd-practice-total-value">
          {dailyTotal}
          <small>min</small>
        </span>
      </div>

      <div className="pd-practice-piece-list">
        {MOCK_ASSIGNMENTS.map((assignment) => (
          <div className="pd-practice-piece-card" key={assignment.id}>
            <div className="pd-practice-piece-info">
              <div className="pd-practice-piece-top">
                <span className="pd-practice-piece-pill">
                  {assignment.pill}
                </span>

                {assignment.name && (
                  <span className="pd-practice-piece-name">
                    {assignment.name}
                  </span>
                )}
              </div>

              {assignment.homework ? (
                <div className="pd-practice-homework-text">
                  {assignment.homework}
                </div>
              ) : (
                <div className="pd-practice-homework-empty">
                  Nothing assigned
                </div>
              )}
            </div>

            <div className="pd-practice-min-cell">
              <input
                className="pd-practice-min-input"
                type="number"
                inputMode="numeric"
                min="0"
                max="300"
                value={selectedDayTasks[assignment.id]?.minutes ?? 0}
                readOnly
              />
              <span className="pd-practice-min-label">Min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
