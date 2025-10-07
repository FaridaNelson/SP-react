import { useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import "./AddLessonModal.css";

const DURATIONS = [
  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
];
export default function AddLessonModal({
  open,
  onClose,
  date,
  student,
  onSubmit,
}) {
  const [studentName, setStudentName] = useState(student?.name || "");
  const [studentId, setStudentId] = useState(student?.id || "");
  const [lengthMin, setLengthMin] = useState(30);
  const [startTime, setStartTime] = useState("16:00");

  const [dateIso, setDateIso] = useState(date || todayIso());

  useEffect(() => {
    if (date) setDateIso(date);
  }, [date, open]);

  function handleSubmit(e, extra = {}) {
    e?.preventDefault?.();
    onSubmit?.({
      studentId,
      studentName,
      date: dateIso,
      startTime,
      lengthMin: Number(lengthMin),
      ...extra,
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Lesson">
      <form className="lessonForm" onSubmit={handleSubmit}>
        <div className="lessonForm__grid">
          <label>
            <span>Date</span>
            <input
              type="date"
              value={dateIso}
              onChange={(e) => setDateIso(e.target.value)}
            />
          </label>

          <label>
            <span>Student's Name</span>
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </label>

          <label>
            <span>Student's Id</span>
            <input
              value={studentId}
              placeholder="Enter Your Student's ID Number"
              onChange={(e) => setStudentId(e.target.value)}
            />
          </label>

          <label>
            <span>Length (min)</span>
            <select
              value={lengthMin}
              onChange={(e) => setLengthMin(e.target.value)}
            >
              {DURATIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Start time</span>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </label>
        </div>

        <div className="lessonForm actions">
          <button type="submit" className="btn">
            Add New Lesson
          </button>
          <button
            type="button"
            className="btn"
            onClick={(e) => handleSubmit(e, { weekly: true })}
          >
            Add a Weekly New Lesson
          </button>
        </div>
      </form>
    </Modal>
  );
}

function todayIso() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
