import { useMemo } from "react";
import "./SnapshotSection.css";
import Donut from "../components/Donut";
import {
  PASS_MARK,
  ELEMENT_META,
  computeReadiness,
  requiredElementsFor,
  getDaysToExam,
  formatExamDate,
} from "../lib/parentUtils";

export default function SnapshotSection({ student, cycle, items }) {
  const readiness = useMemo(() => computeReadiness(items), [items]);

  const required = requiredElementsFor(cycle?.examType);

  const pills = required.map((id) => {
    const item = items.find((i) => i.id === id);
    const score = item?.score ?? null;
    const status = score != null && score >= PASS_MARK ? "done" : "danger";
    return { label: ELEMENT_META[id]?.label ?? id, status };
  });

  const firstRow = pills.slice(0, 3);
  const secondRow = pills.slice(3);

  const gradeLabel = [cycle?.instrument, student?.grade]
    .filter(Boolean)
    .join(" ");
  const daysToExam = getDaysToExam(cycle?.endDate);
  const examDate = formatExamDate(cycle?.endDate);

  const skills = required.map((id) => {
    const item = items.find((i) => i.id === id);
    return {
      id,
      label: item?.label ?? ELEMENT_META[id]?.label ?? id,
      pct: typeof item?.score === "number" ? Math.round(item.score) : 0,
    };
  });

  return (
    <div>
      {/* Dark exam card */}
      <div className="pd-exam-card">
        <div className="pd-exam-inner">
          <div className="pd-exam-left">
            <Donut value={readiness} />
            {examDate && <div className="pd-exam-date">{examDate}</div>}
          </div>

          <div className="pd-exam-info">
            {gradeLabel && <div className="pd-exam-label">{gradeLabel}</div>}
            <div className="pd-exam-title">Spring Exam</div>
            <div className="pd-exam-pills">
              <div className="pd-pills-row">
                {firstRow.map((p, i) => (
                  <span key={i} className={`pd-pill pd-pill--${p.status}`}>
                    {p.status === "done" ? "✓" : "○"} {p.label}
                  </span>
                ))}
              </div>
              {secondRow.length > 0 && (
                <div className="pd-pills-row">
                  {secondRow.map((p, i) => (
                    <span key={i} className={`pd-pill pd-pill--${p.status}`}>
                      {p.status === "done" ? "✓" : "○"} {p.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {daysToExam != null && (
          <div className="pd-exam-countdown">
            <div className="pd-countdown-right">
              <div className="pd-countdown-row">
                <span className="pd-countdown-num">{daysToExam}</span>
                <span className="pd-countdown-unit">days to go</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Skill bars */}
      <div className="pd-section-title">Skill Breakdown</div>
      <div className="pd-card pd-card--pad">
        {skills.map((sk, i) => (
          <div key={sk.id} className="pd-skill-row">
            <div className="pd-skill-top">
              <span className="pd-skill-name">{sk.label}</span>
              <span className="pd-skill-pct">{sk.pct}%</span>
            </div>
            <div className="pd-skill-track">
              <div
                className={`pd-skill-fill ${sk.pct >= PASS_MARK ? "pd-skill-fill--pass" : "pd-skill-fill--fail"}`}
                style={{ width: `${sk.pct}%`, transitionDelay: `${i * 80}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
