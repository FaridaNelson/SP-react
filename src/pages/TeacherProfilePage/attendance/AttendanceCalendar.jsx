import { useMemo, useState, useCallback } from "react";
import Modal from "../../../components/Modal/Modal";
import AddLessonModal from "../modals/AddLessonModal";
import "./AttendanceCalendar.css";

/**
 * Props:
 * - open, onClose
 * - student: {id, name}
 *
 * This is a simple month grid. Colors:
 *  - Red: no-show
 *  - Green: attended
 *  - Orange: rescheduled
 *  - Blue: make-up
 *  - Light blue-gray: scheduled future
 */
export default function AttendanceCalendar({ open, onClose, student }) {
  const [cursor, setCursor] = useState(new Date());
  const [dayModal, setDayModal] = useState(null); // { date: 'YYYY-MM-DD' }
  const [lessonModal, setLessonModal] = useState(null); // { date: 'YYYY-MM-DD' }

  // In real app, fetch attendance for the month by student.id
  const [byDate, setByDate] = useState({}); // 'YYYY-MM-DD': [{ status, title, startTime, lengthMin }]

  const days = useMonthGrid(cursor);

  // DnD: dragging a student onto a calendar day to schedule
  const onDropStudent = useCallback((ev, dateIso) => {
    ev.preventDefault();
    try {
      const payload = JSON.parse(ev.dataTransfer.getData("application/json"));
      // payload: { type: 'student', id, name }
      if (payload?.type === "student") {
        setLessonModal({
          date: dateIso,
          student: { id: payload.id, name: payload.name },
        });
      }
    } catch {}
  }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Take Attendance"
      panelClassName="modal__panel--wide"
    >
      <div className="attCal">
        <div className="attCal__controls">
          <div className="attCal__controls-actions">
            <button
              className="btn btn--attCal"
              onClick={() => setCursor(monthShift(cursor, -1))}
            >
              Previous Month
            </button>

            <div className="attCal__title">
              {cursor.toLocaleString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </div>

            <button
              className="btn btn--attCal"
              onClick={() => setCursor(monthShift(cursor, +1))}
            >
              Next Month
            </button>
          </div>
        </div>

        <div className="attCal__legend">
          <span className="badge is-red">No show</span>
          <span className="badge is-green">Attended</span>
          <span className="badge is-orange">Rescheduled</span>
          <span className="badge is-blue">Make-up</span>
          <span className="badge is-future">Scheduled</span>
        </div>

        <div className="attCal__grid attCal__grid--header">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="attCal__cell attCal__cell--head">
              {d}
            </div>
          ))}
        </div>

        <div className="attCal__grid">
          {days.map((d) => {
            const iso = isoDate(d);
            const items = byDate[iso] || [];
            const isOther = d.getMonth() !== cursor.getMonth();
            return (
              <div
                key={iso}
                className={`attCal__cell ${isOther ? "is-other" : ""}`}
                onClick={() => setDayModal({ date: iso })}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDropStudent(e, iso)}
              >
                <div className="attCal__date">{d.getDate()}</div>
                <div className="attCal__dots">
                  {items.map((it, i) => (
                    <span key={i} className={`dot ${cls(it.status)}`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Day details */}
        <Modal
          open={!!dayModal}
          onClose={() => setDayModal(null)}
          title={dayModal ? new Date(dayModal.date).toDateString() : ""}
        >
          <div className="attCal__day">
            <button
              className="btn btn--primary"
              onClick={() => {
                setLessonModal({ date: dayModal.date, student });
              }}
            >
              Add New Lesson
            </button>
            <ul className="attCal__list" role="list">
              {(byDate[dayModal?.date] || []).map((it, i) => (
                <li key={i} className="attCal__lesson">
                  <span className={`dot ${cls(it.status)}`} />
                  <strong>{it.title}</strong> · {it.startTime} · {it.lengthMin}{" "}
                  min
                </li>
              ))}
            </ul>
          </div>
        </Modal>

        {/* Add lesson */}
        <AddLessonModal
          open={!!lessonModal}
          onClose={() => setLessonModal(null)}
          date={lessonModal?.date || ""}
          student={lessonModal?.student || student}
          onSubmit={(payload) => {
            // Persist to backend here, e.g. POST /api/lessons
            // For demo, add to local state with 'future' status:
            const list = byDate[payload.date] || [];
            const entry = {
              status: "future",
              title: payload.studentName || "Lesson",
              startTime: payload.startTime,
              lengthMin: payload.lengthMin,
            };
            setByDate((prev) => ({
              ...prev,
              [payload.date]: [...list, entry],
            }));
            setLessonModal(null);
          }}
        />
      </div>
    </Modal>
  );
}

function cls(status) {
  switch (status) {
    case "noshow":
      return "is-red";
    case "attended":
      return "is-green";
    case "rescheduled":
      return "is-orange";
    case "makeup":
      return "is-blue";
    default:
      return "is-future";
  }
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}
function monthShift(d, n) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function useMonthGrid(cursor) {
  return useMemo(() => {
    const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const first = new Date(start);
    first.setDate(first.getDate() - ((first.getDay() + 6) % 7)); // Monday-first
    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(first);
      d.setDate(first.getDate() + i);
      days.push(d);
    }
    return days;
  }, [cursor]);
}
