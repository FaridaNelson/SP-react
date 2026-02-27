import { useEffect, useMemo, useState } from "react";
import "./AssignmentBreakdown.css";

const PASS_MARK = 67;

function clampPct(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, x));
}

function statusFor(pct) {
  return pct >= PASS_MARK ? "pass" : pct > 0 ? "needs" : "empty";
}

function statusLabel(pct) {
  if (pct >= PASS_MARK) return "✓ Pass";
  if (pct > 0) return "✗ Needs work";
  return "—";
}

export default function AssignmentBreakdown({
  items = [],
  passMark = PASS_MARK,
  title = "Skill breakdown",
  animateKey,
  subtitle, // optional little helper text
}) {
  const safe = useMemo(
    () =>
      items
        .filter((it) => it && it.id)
        .map((it) => ({
          ...it,
          score: clampPct(it.score),
          weight: Number(it.weight) || 0,
        })),
    [items],
  );

  // displayed percentages for animation: { [id]: number }
  const [shown, setShown] = useState({});

  // animate bars when student changes (or when list changes)
  useEffect(() => {
    // If no key provided, still animate once when safe changes.
    // Reset to 0 first:
    const zeros = Object.fromEntries(safe.map((it) => [it.id, 0]));
    setShown(zeros);

    // Next frame: set targets so CSS transition runs smoothly
    const raf = requestAnimationFrame(() => {
      const targets = Object.fromEntries(
        safe.map((it) => [it.id, clampPct(it.score)]),
      );
      setShown(targets);
    });

    return () => cancelAnimationFrame(raf);
  }, [animateKey, safe]);

  return (
    <section className="brk">
      <header className="brk__head">
        <div>
          <h3 className="brk__title">{title}</h3>
          {subtitle ? <p className="brk__sub">{subtitle}</p> : null}
        </div>

        <div className="brk__pill">
          <span className="brk__pillLabel">Pass mark</span>
          <span className="brk__pillVal">{passMark}%</span>
        </div>
      </header>

      <div className="brk__list">
        {safe.map((it) => {
          const pct = clampPct(it.score);
          const st = statusFor(pct, passMark);

          // this is what actually animates
          const w = shown[it.id] ?? 0;

          return (
            <div key={it.id} className="brk__item">
              <div className="brk__itemTop">
                <div className="brk__label">{it.label}</div>

                <div className="brk__right">
                  <span className={`brk__chip brk__chip--${st}`}>
                    {statusLabel(pct, passMark)}
                  </span>
                  <span className={`brk__val brk__val--${st}`}>
                    {Math.round(pct)}%
                  </span>
                </div>
              </div>

              <div className="brk__barwrap" aria-label={`${it.label} ${pct}%`}>
                <div
                  className={`brk__bar brk__bar--${st}`}
                  style={{ width: `${w}%` }}
                />
                <div className="brk__mark" style={{ left: `${passMark}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
