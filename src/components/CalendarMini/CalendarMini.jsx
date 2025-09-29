import { useMemo, useState } from "react";
import "./CalendarMini.css";

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function keyFor(d) {
  return d.toISOString().slice(0, 10);
}

export default function CalendarMini() {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(new Date());
  const [events, setEvents] = useState({}); // { "YYYY-MM-DD": ["Lesson 4:30 PM"] }

  const grid = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);
    const first = new Date(start);
    first.setDate(first.getDate() - ((first.getDay() + 6) % 7)); // Monday-first grid
    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(first);
      d.setDate(first.getDate() + i);
      days.push(d);
    }
    return days;
  }, [cursor]);

  const selKey = keyFor(selected);
  const items = events[selKey] || [];

  function addEvent(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = (form.get("note") || "").toString().trim();
    if (!text) return;
    setEvents((prev) => ({
      ...prev,
      [selKey]: [...(prev[selKey] || []), text],
    }));
    e.currentTarget.reset();
  }

  return (
    <div className="cal">
      <div className="cal__nav">
        <button
          className="cal__btn"
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
          }
        >
          ←
        </button>
        <div className="cal__title">
          {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button
          className="cal__btn"
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
          }
        >
          →
        </button>
      </div>

      <div className="cal__grid cal__grid--header">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="cal__cell cal__cell--head">
            {d}
          </div>
        ))}
      </div>

      <div className="cal__grid">
        {grid.map((d) => {
          const k = keyFor(d);
          const isOther = d.getMonth() !== cursor.getMonth();
          const isSel = k === selKey;
          const has = (events[k]?.length || 0) > 0;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setSelected(d)}
              className={`cal__cell ${isOther ? "is-other" : ""} ${
                isSel ? "is-sel" : ""
              }`}
              title={has ? `${events[k].length} note(s)` : ""}
            >
              <span className="cal__date">{d.getDate()}</span>
              {has && <span className="cal__dot" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <div className="cal__panel">
        <h4 className="cal__paneltitle">
          {selected.toLocaleDateString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </h4>
        {items.length ? (
          <ul className="cal__list" role="list">
            {items.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        ) : (
          <p className="cal__empty">No notes for this day.</p>
        )}

        <form className="cal__form" onSubmit={addEvent}>
          <input className="cal__input" name="note" placeholder="Add a note…" />
          <button className="cal__btn" type="submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
