import { useEffect, useRef, useState } from "react";
import "./Timer.css";

export default function Timer() {
  const [mode, setMode] = useState("stopwatch"); // "stopwatch" | "countdown"
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const tickRef = useRef(null);

  useEffect(() => () => clearInterval(tickRef.current), []);

  function start() {
    if (running) return;
    const startAt = performance.now();
    const base = ms;
    setRunning(true);
    tickRef.current = setInterval(() => {
      const delta = performance.now() - startAt;
      const next =
        mode === "stopwatch" ? base + delta : Math.max(0, base - delta);
      setMs(next);
      if (mode === "countdown" && next <= 0) {
        clearInterval(tickRef.current);
        setRunning(false);
        // tiny beep
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const o = ctx.createOscillator(),
            g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.value = 1000;
          g.gain.setValueAtTime(0.2, ctx.currentTime);
          o.start();
          o.stop(ctx.currentTime + 0.15);
        } catch {}
      }
    }, 50);
  }

  function stop() {
    clearInterval(tickRef.current);
    setRunning(false);
  }

  function reset() {
    stop();
    setMs(mode === "stopwatch" ? 0 : 5 * 60 * 1000); // default 5min for countdown
  }

  // initialize when mode changes
  useEffect(() => reset(), [mode]);

  const totalSec = Math.round(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pretty = `${h ? String(h).padStart(2, "0") + ":" : ""}${String(
    m
  ).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  return (
    <div className="tool">
      <div className="tool__row">
        <select
          className="tool__select"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="stopwatch">Stopwatch</option>
          <option value="countdown">Countdown</option>
        </select>
      </div>

      <div className="timer__display">{pretty}</div>

      {mode === "countdown" && (
        <div className="tool__row">
          <label className="tool__label">
            Minutes
            <input
              className="tool__number"
              type="number"
              min={0}
              max={600}
              value={Math.floor(totalSec / 60)}
              onChange={(e) =>
                setMs(Math.max(0, Number(e.target.value)) * 60 * 1000)
              }
            />
          </label>
        </div>
      )}

      <div className="tool__row">
        {!running ? (
          <button className="tool__btn" onClick={start}>
            Start
          </button>
        ) : (
          <button className="tool__btn" onClick={stop}>
            Pause
          </button>
        )}
        <button className="tool__btn" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
