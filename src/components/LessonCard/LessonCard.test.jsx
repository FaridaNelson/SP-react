import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

globalThis.React = React;

const { default: LessonCard } = await import("./LessonCard");

const cycle = {
  examType: "Practical",
};

function renderLesson(overrides = {}) {
  const lesson = {
    lessonDate: "2026-09-18",
    teacherNarrative: "Lesson note",
    pieces: [],
    scales: { items: [] },
    ...overrides,
  };

  return renderToStaticMarkup(
    <LessonCard lesson={lesson} cycle={cycle} readOnly />,
  );
}

describe("LessonCard optional score sections", () => {
  it("renders Sight Reading 0%", () => {
    const html = renderLesson({
      sightReading: { score: 0 },
    });

    expect(html).toContain("Sight Reading");
    expect(html).toContain("0%");
  });

  it("renders Aural Training 0%", () => {
    const html = renderLesson({
      auralTraining: { score: 0 },
    });

    expect(html).toContain("Aural Training");
    expect(html).toContain("0%");
  });

  it("renders positive Sight Reading and Aural Training values", () => {
    const html = renderLesson({
      sightReading: { score: 72 },
      auralTraining: { score: 81 },
    });

    expect(html).toContain("Sight Reading");
    expect(html).toContain("72%");
    expect(html).toContain("Aural Training");
    expect(html).toContain("81%");
  });

  it("does not render null or undefined Sight Reading", () => {
    expect(renderLesson({ sightReading: { score: null } })).not.toContain(
      "Sight Reading",
    );
    expect(renderLesson({ sightReading: undefined })).not.toContain(
      "Sight Reading",
    );
  });

  it("does not render null or undefined Aural Training", () => {
    expect(renderLesson({ auralTraining: { score: null } })).not.toContain(
      "Aural Training",
    );
    expect(renderLesson({ auralTraining: undefined })).not.toContain(
      "Aural Training",
    );
  });
});
