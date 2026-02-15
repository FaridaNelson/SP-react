import { useMemo, useState } from "react";
import { useProgress } from "../../hooks/useProgress";
import { computeReadiness } from "../../lib/progress";
import ProgressDonut from "../../components/ProgressDonut/ProgressDonut";
import AssignmentBreakdown from "../../components/AssignmentBreakdown/AssignmentBreakdown";
import AddScoreModal from "./modals/AddScoreModal";
import AttendanceCalendar from "./attendance/AttendanceCalendar";
import { api } from "../../lib/api";
import "./TeacherStudentInfo.css";

export default function TeacherStudentInfo({ student }) {
  const { id: studentId, _id, name } = student || {};
  const { items, setItems, saveScores, addScoreEntries, isLoading } =
    useProgress(studentId || _id);
  const readiness = useMemo(() => computeReadiness(items), [items]);

  const [scoreOpen, setScoreOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const grouped = useMemo(() => {
    const groups = new Map();

    for (const h of history) {
      const d = h.lessonDate || h.createdAt;
      const key = d ? new Date(d).toISOString().slice(0, 10) : "unknown";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(h);
    }

    // newest date first
    return Array.from(groups.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, entries]) => ({
        date,
        entries: entries.sort(
          (x, y) =>
            new Date(y.createdAt || y.lessonDate) -
            new Date(x.createdAt || x.lessonDate),
        ),
      }));
  }, [history]);

  const sid = _id || studentId || "";

  async function loadHistory() {
    if (!sid) return;
    setHistoryLoading(true);
    try {
      // expected: { entries: [...] } OR just [...]
      const data = await api(`/api/teacher/students/${sid}/scores?limit=50`);
      setHistory(Array.isArray(data) ? data : data.items || data.entries || []);
    } catch (e) {
      console.error("Failed to load score history", e);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }

  if (!student) {
    return (
      <div className="teacherStudentInfo teacherStudentInfo--empty">
        <p>Select a student.</p>
      </div>
    );
  }

  if (isLoading) return <p>Loading {name}…</p>;

  const inviteCode = (student.inviteCode || "").toString().toUpperCase();
  const email = student.email || "";
  const parentName = student.parent?.name || student.parentName || "";
  const parentEmail = student.parent?.email || student.parentEmail || "";

  return (
    <section className="teacherStudentInfo">
      <header className="tsi__head">
        <h1 className="tsi__title">{name}</h1>
        <div className="tsi__actions">
          <button
            className="btn btn--primary"
            onClick={() => setScoreOpen(true)}
          >
            Add New Score
          </button>
          <button className="btn" onClick={() => setAttendanceOpen(true)}>
            Take Attendance
          </button>
        </div>
      </header>

      <div className="tsi__infocard">
        <InfoRow label="Student Name" value={name} />
        <InfoRow label="Student's Email" value={email || "-"} />
        <InfoRow
          label="Invite ID Code"
          value={inviteCode || "-"}
          copyValue={inviteCode || null}
        />
        <InfoRow
          label="Student ID"
          value={sid || "-"}
          copyValue={sid || null}
        />
        <InfoRow label="Parent Name" value={parentName || "-"} />
        <InfoRow label="Parent's Email" value={parentEmail || "-"} />
      </div>

      <div className="tsi__grid">
        <div className="tsi__card">
          <ProgressDonut value={readiness} label="Readiness" />
        </div>
        <div className="tsi__card tsi__span">
          <h2 className="tsi__h2">By Assignment Element</h2>
          <AssignmentBreakdown items={items} />
        </div>
      </div>

      <div className="tsi__historyBar">
        <button
          className="btn"
          onClick={async () => {
            const next = !historyOpen;
            setHistoryOpen(next);
            if (next) await loadHistory();
          }}
        >
          {historyOpen ? "Hide History" : "Score History"}
        </button>
      </div>

      {historyOpen && (
        <div className="tsi__history">
          {historyLoading ? (
            <p>Loading history…</p>
          ) : history.length === 0 ? (
            <p>No score history yet.</p>
          ) : (
            <div className="tsi__historyCards">
              {grouped.map((g) => (
                <section key={g.date} className="tsi__lessonCard">
                  <div className="tsi__lessonCardHead">
                    <h3 className="tsi__lessonTitle">
                      Lesson • {new Date(g.date).toLocaleDateString()}
                    </h3>
                    <span className="tsi__lessonMeta">
                      {g.entries.length} entries
                    </span>
                  </div>

                  <ul className="tsi__lessonEntries">
                    {g.entries.map((h) => (
                      <li key={h._id} className="tsi__lessonEntry">
                        <div className="tsi__entryMain">
                          <strong>{h.elementLabel || h.elementId}</strong>
                          {h.score != null ? `: Score: ${h.score}%` : ""}
                          {h.tempoCurrent != null
                            ? ` • Tempo: ${h.tempoCurrent}${h.tempoGoal != null ? `/${h.tempoGoal}` : ""}`
                            : ""}
                        </div>
                        {h.dynamics ? (
                          <div className="tsi__historyNote">
                            <strong>Dynamics:</strong> {h.dynamics}
                          </div>
                        ) : null}

                        {h.articulation ? (
                          <div className="tsi__historyNote">
                            <strong>Articulation:</strong> {h.articulation}
                          </div>
                        ) : null}

                        <div className="tsi__entryTime">
                          {new Date(
                            h.createdAt || h.lessonDate,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      )}

      <AddScoreModal
        open={scoreOpen}
        onClose={() => setScoreOpen(false)}
        onSubmit={(entries) => {
          const byId = Object.fromEntries(entries.map((e) => [e.elementId, e]));

          const next = items.map((it) => {
            const e = byId[it.id];
            if (!e) return it;
            return { ...it, score: e.score ?? it.score };
          });

          setItems(next);
          saveScores(next);
          addScoreEntries(entries);

          // optional: refresh history if open
          if (historyOpen) loadHistory();

          setScoreOpen(false);
        }}
      />

      <AttendanceCalendar
        open={attendanceOpen}
        onClose={() => setAttendanceOpen(false)}
        student={student}
      />
    </section>
  );
}

function InfoRow({ label, value, copyValue }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    if (!copyValue) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }
  return (
    <div className="tsi__inforow">
      <div className="tsi__label">{label}</div>
      <div className="tsi__value">
        <span className="tsi__text" title={String(value)}>
          {String(value)}
        </span>
        {copyValue && (
          <button
            type="button"
            className="tsi__copybtn"
            onClick={copy}
            aria-label={`Copy ${label}`}
            data-copied={copied || undefined}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}
