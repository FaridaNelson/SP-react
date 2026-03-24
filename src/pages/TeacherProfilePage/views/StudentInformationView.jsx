import { useEffect, useState, useCallback } from "react";
import { api } from "../../../lib/api";
import "./StudentInformationView.css";

function displayGrade(derivedGrade, instrument) {
  const inst = instrument || "Piano";
  if (derivedGrade == null) return `Grade — ${inst}`;
  return `Grade ${derivedGrade} ${inst}`;
}

function PencilIcon() {
  return (
    <svg
      className="siv__pencilSvg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function EditableField({
  label,
  value,
  fieldKey,
  type = "text",
  serif,
  onSave,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  function startEdit() {
    setDraft(value);
    setEditing(true);
    setStatus(null);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  async function save() {
    if (draft === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      await onSave(fieldKey, draft);
      setEditing(false);
      setStatus("success");
      setTimeout(() => setStatus(null), 1500);
    } catch {
      setDraft(value);
      setEditing(false);
      setStatus("error");
      setTimeout(() => setStatus(null), 2500);
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") save();
    if (e.key === "Escape") cancel();
  }

  const displayValue = value || "—";

  return (
    <div className="siv__field">
      <div className="siv__label">{label}</div>
      {editing ? (
        <div className="siv__editRow">
          <input
            className={`siv__editInput ${serif ? "siv__editInput--serif" : ""}`}
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={saving}
            autoFocus
          />
          <button
            className="siv__saveBtn"
            onClick={save}
            disabled={saving}
            type="button"
          >
            {saving ? "…" : "Save"}
          </button>
          <button
            className="siv__cancelBtn"
            onClick={cancel}
            disabled={saving}
            type="button"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className={`siv__valueWrap ${serif ? "siv__value--serif" : "siv__value"}`}>
          <span>{displayValue}</span>
          <button
            type="button"
            className="siv__pencilBtn"
            onClick={startEdit}
            aria-label={`Edit ${label}`}
          >
            <PencilIcon />
          </button>
          {status === "success" && (
            <span className="siv__statusOk">Saved</span>
          )}
          {status === "error" && (
            <span className="siv__statusErr">Error</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function StudentInformationView({ student, user }) {
  const studentId = student?._id || student?.id;
  const [full, setFull] = useState(null);
  const [derivedGrade, setDerivedGrade] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    let cancelled = false;
    api(`/api/students/${studentId}`)
      .then((data) => {
        if (!cancelled) setFull(data?.student || data);
      })
      .catch((err) => console.error("Failed to fetch full student", err));
    return () => { cancelled = true; };
  }, [studentId]);

  // Derive grade from completed exam cycles
  useEffect(() => {
    if (!studentId) return;
    let cancelled = false;
    api(`/api/exam-cycles/student/${studentId}`)
      .then((data) => {
        if (cancelled) return;
        const cycles = Array.isArray(data) ? data : data?.examCycles || data?.cycles || [];
        const completed = cycles.filter((c) => c.status === "completed");
        if (completed.length > 0) {
          const highest = Math.max(...completed.map((c) => Number(c.examGrade)));
          setDerivedGrade(highest);
        }
      })
      .catch((err) => console.error("Failed to fetch exam cycles", err));
    return () => { cancelled = true; };
  }, [studentId]);

  const s = full || student;

  const handleSave = useCallback(
    async (fieldKey, newValue) => {
      const parentFields = ["parentFirstName", "parentLastName", "parentEmail", "parentPhone"];
      let body;

      if (parentFields.includes(fieldKey)) {
        const shortKey = fieldKey.replace("parent", "");
        const snapshotKey = shortKey.charAt(0).toLowerCase() + shortKey.slice(1);
        body = { parentContactSnapshot: { [snapshotKey]: newValue } };
      } else {
        body = { [fieldKey]: newValue };
      }

      const updated = await api(`/api/students/${studentId}`, {
        method: "PATCH",
        body,
      });

      setFull(updated?.student || updated);
    },
    [studentId],
  );

  if (!s) return null;

  const firstName = s.firstName || s.name?.split(" ")[0] || "—";
  const lastName =
    s.lastName || s.name?.split(" ").slice(1).join(" ") || "—";

  const pcs = s.parentContactSnapshot || {};

  const parentFirstName = pcs.firstName || "—";
  const parentLastName = pcs.lastName || "—";

  const studentEmail = s.email || "—";

  const parentEmail = pcs.email || "—";
  const parentPhone = pcs.phone || "—";

  const teacherName =
    user?.name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "—";

  const gradeDisplay = derivedGrade != null ? `Grade ${derivedGrade}` : "Grade —";

  return (
    <div className="siv">
      <header className="siv__topbar">
        <div>
          <h1 className="siv__name">
            {s.name ||
              `${s.firstName || ""} ${s.lastName || ""}`.trim() ||
              "Student"}
          </h1>
          <p className="siv__sub">
            {displayGrade(derivedGrade, s.instrument)} · Student Information
          </p>
        </div>
      </header>

      <div className="siv__content">
        <section className="siv__section">
          <h2 className="siv__sectionTitle">Student Details</h2>

          <div className="siv__card siv__card--large">
            <div className="siv__grid siv__grid--2">
              <EditableField
                label="First Name"
                value={firstName !== "—" ? firstName : ""}
                fieldKey="firstName"
                serif
                onSave={handleSave}
              />

              <EditableField
                label="Last Name"
                value={lastName !== "—" ? lastName : ""}
                fieldKey="lastName"
                serif
                onSave={handleSave}
              />

              <EditableField
                label="Student Email"
                value={studentEmail !== "—" ? studentEmail : ""}
                fieldKey="email"
                type="email"
                onSave={handleSave}
              />

              <div className="siv__field">
                <div className="siv__label">Grade</div>
                <div className="siv__value">{gradeDisplay}</div>
                <div className="siv__helper">Updates automatically when an exam cycle is completed</div>
              </div>

              <div className="siv__field">
                <div className="siv__label">Instrument</div>
                <div className="siv__value">{s.instrument || "Piano"}</div>
                <div className="siv__helper">Set at registration</div>
              </div>

              <div className="siv__field">
                <div className="siv__label">Teacher</div>
                <div className="siv__value">{teacherName}</div>
              </div>
            </div>

          </div>
        </section>

        <div className="siv__bottomGrid">
          <section className="siv__section">
            <h2 className="siv__sectionTitle">Parent / Guardian</h2>

            <div className="siv__card">
              <div className="siv__grid siv__grid--2">
                <EditableField
                  label="First Name"
                  value={parentFirstName !== "—" ? parentFirstName : ""}
                  fieldKey="parentFirstName"
                  serif
                  onSave={handleSave}
                />

                <EditableField
                  label="Last Name"
                  value={parentLastName !== "—" ? parentLastName : ""}
                  fieldKey="parentLastName"
                  serif
                  onSave={handleSave}
                />

                <EditableField
                  label="Parent Email"
                  value={parentEmail !== "—" ? parentEmail : ""}
                  fieldKey="parentEmail"
                  type="email"
                  onSave={handleSave}
                />

                <EditableField
                  label="Contact Phone"
                  value={parentPhone !== "—" ? parentPhone : ""}
                  fieldKey="parentPhone"
                  type="tel"
                  onSave={handleSave}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
