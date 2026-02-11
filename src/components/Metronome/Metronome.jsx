import { useEffect, useRef, useState } from "react";
import "./Metronome.css";

/**
 * Accurate WebAudio metronome with tap tempo and accents.
 * No external deps. Creates the AudioContext on first "Start".
 */
export default function Metronome() {
  const [bpm, setBpm] = useState(80);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [running, setRunning] = useState(false);

  const ctxRef = useRef(null);
  const timerRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const beatIndexRef = useRef(0);

  // Tap tempo
  const tapsRef = useRef([]);

  function makeCtx() {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctxRef.current;
  }

  function scheduleClick(time) {
    const ctx = makeCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const accent = beatIndexRef.current % beatsPerBar === 0;
    osc.frequency.value = accent ? 1200 : 850;
    gain.gain.value = accent ? 0.25 : 0.16;

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.045);
  }

  function advanceNote() {
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTimeRef.current += secondsPerBeat;
    beatIndexRef.current = (beatIndexRef.current + 1) % beatsPerBar;
  }

  function scheduler() {
    const ctx = makeCtx();
    // schedule a little bit ahead
    while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
      scheduleClick(nextNoteTimeRef.current);
      advanceNote();
    }
    timerRef.current = setTimeout(scheduler, 25);
  }

  function start() {
    const ctx = makeCtx();
    if (ctx.state === "suspended") ctx.resume();
    beatIndexRef.current = 0;
    nextNoteTimeRef.current = ctx.currentTime + 0.06;
    setRunning(true);
    scheduler();
  }

  function stop() {
    setRunning(false);
    clearTimeout(timerRef.current);
  }

  function tap() {
    const now = performance.now();
    const taps = tapsRef.current;
    taps.push(now);
    if (taps.length > 6) taps.shift();
    if (taps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < taps.length; i++)
        intervals.push(taps[i] - taps[i - 1]);
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const newBpm = Math.max(30, Math.min(300, Math.round(60000 / avgMs)));
      setBpm(newBpm);
    }
  }

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className="tool tool--metronome">
      <div className="tool__row">
        <label className="tool__label">
          BPM
          <input
            className="tool__number"
            type="number"
            min={30}
            max={300}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
          />
        </label>

        <label className="tool__label">
          Beats / bar
          <input
            className="tool__number"
            type="number"
            min={1}
            max={12}
            value={beatsPerBar}
            onChange={(e) => setBeatsPerBar(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="tool__row">
        {!running ? (
          <button className="tool__btn" onClick={start}>
            Start
          </button>
        ) : (
          <button className="tool__btn" onClick={stop}>
            Stop
          </button>
        )}
        <button className="tool__btn" onClick={tap} title="Tap tempo">
          Tap
        </button>
      </div>
    </div>
  );
}
