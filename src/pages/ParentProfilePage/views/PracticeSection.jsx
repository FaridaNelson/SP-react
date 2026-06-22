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

const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

function buildWeek(today) {
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay()); // rewind to Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

function summaryThemeFor(count) {
  if (count >= 6) return "green";
  if (count >= 4) return "sage";
  if (count >= 2) return "yellow";
  return "rose";
}

// Csrf token helper:
async function getCsrfToken() {
  const res = await fetch(`${API_BASE}/api/csrf-token`, {
    credentials: "include",
  });
  const data = await res.json();
  return data.csrfToken;
}

function createEmptyTaskRecord() {
  return {
    status: "notCovered",
    minutes: 0,
    taskOutcome: "none",
    note: "",
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
        : createEmptyTaskRecord();
    }
  }

  return result;
}

function normalizeTasksByDayFromServer(serverTasksByDay) {
  const result = {};

  for (const [dayKey, dayTasks] of Object.entries(serverTasksByDay || {})) {
    result[dayKey] = {};

    for (const [taskId, taskData] of Object.entries(dayTasks || {})) {
      result[dayKey][taskId] =
        taskData?.status === "practiced"
          ? createPracticedTaskRecord(taskData)
          : createEmptyTaskRecord();
    }
  }

  return result;
}

// ─── Component ────────────────────────────────────────────────────

export default function PracticeSection({
  studentName,
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

  const todayKey = useMemo(() => dateKey(today), [today]);
  const days = useMemo(() => buildWeek(today), [today]);
  // { "YYYY-MM-DD": { pieceA: { status, minutes, taskOutcome, note }, ... } }
  const [tasksByDay, setTasksByDay] = useState({});
  const [savePracticeLogStatus, setSavePracticeLogStatus] = useState("idle"); // "idle" | "saving" | "saved" | "error"
  // Keep a ref to latest tasksByDay for the unmount save
  const tasksByDayRef = useRef(tasksByDay);
  useEffect(() => {
    tasksByDayRef.current = tasksByDay;
  }, [tasksByDay]);

  const savePracticeLog = useCallback(async () => {
    const snapshot = tasksByDayRef.current;
    if (!studentId || !cycle?._id) return;

    const hasData = Object.values(snapshot).some((dayTasks) =>
      Object.values(dayTasks).some(isTaskPracticed),
    );
    if (!hasData) return;

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
  const practicedDays = useMemo(() => {
    const set = new Set();
    for (const [day, dayTasks] of Object.entries(tasksByDay)) {
      if (Object.values(dayTasks).some(isTaskPracticed)) set.add(day);
    }
    return set;
  }, [tasksByDay]);

  const practicedCount = useMemo(
    () => days.filter((d) => practicedDays.has(dateKey(d))).length,
    [days, practicedDays],
  );

  const summaryTheme = summaryThemeFor(practicedCount);

  // ── Toggle a task for any day ───────────────────────────────────
  const toggleTaskForDay = useCallback((dayKey, taskId) => {
    setSavePracticeLogStatus("idle");

    setTasksByDay((prev) => {
      const current = prev[dayKey] ?? {};
      const currentTask = current[taskId];
      const currentlyPracticed = isTaskPracticed(currentTask);

      return {
        ...prev,
        [dayKey]: {
          ...current,
          [taskId]: currentlyPracticed
            ? createEmptyTaskRecord()
            : createPracticedTaskRecord(currentTask),
        },
      };
    });
  }, []);

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="pd-card pd-card--pad">
      <div className="pd-practice-header">
        <div className="pd-practice-title">Practice Record</div>
        <div className="pd-practice-sub">
          Track {studentName}&apos;s practice sessions this week
        </div>
      </div>

      {/* Summary — colour coded by days practiced */}
      <div
        className={`pd-practice-summary pd-practice-summary--${summaryTheme}`}
      >
        <div className="pd-practice-summary-label">This Week</div>
        <div className="pd-practice-summary-count">{practicedCount} / 7</div>
        <div className="pd-practice-summary-sub">days practiced</div>
      </div>

      {/* Action row: Save button + status */}
      <div className="pd-practice-actions">
        <button
          type="button"
          className="pd-practice-save-btn"
          onClick={savePracticeLog}
          disabled={savePracticeLogStatus === "saving"}
        >
          {savePracticeLogStatus === "saving"
            ? "Saving..."
            : "Save Practice Record"}
        </button>

        {savePracticeLogStatus === "saved" && (
          <span className="pd-practice-save-status">Saved</span>
        )}

        {savePracticeLogStatus === "error" && (
          <span className="pd-practice-save-status pd-practice-save-status--error">
            Could not save
          </span>
        )}
      </div>
      {/* Week list — one row per day */}
      <div className="pd-week-list">
        {days.map((d) => {
          const key = dateKey(d);
          const isToday = key === todayKey;
          const isFuture = d > today;
          const dayTasks = tasksByDay[key] ?? {};
          const practicedItems = tasks.filter((t) =>
            isTaskPracticed(dayTasks[t.id]),
          );
          return (
            <div
              key={key}
              className={[
                "pd-week-row",
                isToday && "pd-week-row--today",
                isFuture && "pd-week-row--future",
                practicedItems.length > 0 && "pd-week-row--done",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="pd-week-day-label">
                <span className="pd-week-abbr">{DAY_ABBR[d.getDay()]}</span>
                <span className="pd-week-num">{d.getDate()}</span>
              </div>
              <div className="pd-week-tasks">
                {isFuture ? (
                  <span className="pd-week-no-practice">—</span>
                ) : (
                  tasks.map((task) => {
                    const done = isTaskPracticed(tasksByDay[key]?.[task.id]);
                    return (
                      <button
                        key={task.id}
                        className={`pd-week-pill${done ? " pd-week-pill--done" : ""}`}
                        onClick={() => toggleTaskForDay(key, task.id)}
                      >
                        {task.label}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
