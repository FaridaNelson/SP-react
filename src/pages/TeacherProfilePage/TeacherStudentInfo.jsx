import { useMemo, useState } from "react";
import { useProgress } from "../../hooks/useProgress";
import { computeReadiness } from "../../lib/progress";
import ProgressDonut from "../../components/ProgressDonut/ProgressDonut";
import AssignmentBreakdown from "../../components/AssignmentBreakdown/AssignmentBreakdown";
import AddScoreModal from "./modals/AddScoreModal";
import AttendanceCalendar from "./attendance/AttendanceCalendar";
import "./TeacherStudentInfo.css";

export default function TeacherStudentInfo({ student }) {
  const { id: studentId, _id, name } = student || {};
  const { items, setItems, saveScores, isLoading } = useProgress(
    studentId || _id
  );
  const readiness = useMemo(() => computeReadiness(items), [items]);

  const [scoreOpen, setScoreOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  if (!student) {
    return (
      <div className="teacherStudentInfo teacherStudentInfo--empty">
        <p>Select a student.</p>
      </div>
    );
  }

  if (isLoading) return <p>Loading {name}…</p>;

  const sid = _id || studentId || "";
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

      <AddScoreModal
        open={scoreOpen}
        onClose={() => setScoreOpen(false)}
        onSubmit={(payload) => {
          // merge with items -> optimistic save
          const next = items.map((it) => {
            const p = payload[it.id];
            return p ? { ...it, score: p.score ?? it.score } : it;
          });
          setItems(next);
          saveScores(next);
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
