import "./ProfileReminders.css";

export default function ProfileReminders({
  nextLessonLabel,
  nextLessonTime,
  teacherName,
  onDismiss,
}) {
  return (
    <section className="reminders" aria-labelledby="reminders-title">
      <header className="reminders__header">
        <h2 id="reminders-title" className="reminders__title">
          Reminders
        </h2>
        <button
          type="button"
          className="reminders__close"
          aria-label="Dismiss reminders"
          onClick={onDismiss}
        >
          x
        </button>
      </header>
      <p className="reminders__item">
        <span className="reminders__label">{nextLessonLabel} </span>
        <strong>{nextLessonTime}</strong> (with {teacherName})
      </p>
    </section>
  );
}
