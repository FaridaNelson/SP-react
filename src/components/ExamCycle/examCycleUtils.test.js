import { describe, it, expect } from "vitest";
import { sortCycles, buildLessonReadiness } from "./examCycleUtils";

describe("sortCycles", () => {
  it('active cycle (status "current") sorts before completed', () => {
    const cycles = [
      { id: "1", status: "completed", updatedAt: "2026-03-01" },
      { id: "2", status: "current" },
    ];
    const result = sortCycles(cycles);
    expect(result[0].id).toBe("2");
    expect(result[1].id).toBe("1");
  });

  it('active cycle (status "registered") sorts before completed', () => {
    const cycles = [
      { id: "1", status: "completed", updatedAt: "2026-03-01" },
      { id: "2", status: "registered" },
    ];
    const result = sortCycles(cycles);
    expect(result[0].id).toBe("2");
  });

  it("two closed cycles: more recently closed one comes first", () => {
    const cycles = [
      { id: "old", status: "completed", examTaken: "2025-01-01" },
      { id: "new", status: "completed", examTaken: "2026-01-01" },
    ];
    const result = sortCycles(cycles);
    expect(result[0].id).toBe("new");
    expect(result[1].id).toBe("old");
  });

  it("empty array returns empty array", () => {
    expect(sortCycles([])).toEqual([]);
  });

  it("mixed active + closed: active always first regardless of dates", () => {
    const cycles = [
      { id: "c1", status: "completed", examTaken: "2026-12-31" },
      { id: "a1", status: "current" },
      { id: "c2", status: "withdrawn", updatedAt: "2026-06-01" },
      { id: "a2", status: "registered" },
    ];
    const result = sortCycles(cycles);
    // Both active cycles come first
    const firstTwo = result.slice(0, 2).map((c) => c.id);
    expect(firstTwo).toContain("a1");
    expect(firstTwo).toContain("a2");
    // Closed cycles come after
    const lastTwo = result.slice(2).map((c) => c.id);
    expect(lastTwo).toContain("c1");
    expect(lastTwo).toContain("c2");
  });
});

describe("buildLessonReadiness", () => {
  it("empty array returns []", () => {
    expect(buildLessonReadiness([])).toEqual([]);
  });

  it("single scored lesson returns one readiness point", () => {
    const lessons = [
      {
        lessonDate: "2026-03-10T10:00:00Z",
        lessonTotalScore: 72,
      },
    ];

    const result = buildLessonReadiness(lessons);

    expect(result).toHaveLength(1);
    expect(result[0].date).toBe("2026-03-10");
    expect(result[0].readiness).toBe(72);
    expect(result[0].lessonLabel).toBe("L1");
  });

  it("orders scored lessons chronologically", () => {
    const lessons = [
      {
        lessonDate: "2026-03-15T10:00:00Z",
        lessonTotalScore: 80,
      },
      {
        lessonDate: "2026-03-10T10:00:00Z",
        lessonTotalScore: 65,
      },
    ];

    const result = buildLessonReadiness(lessons);

    expect(result).toHaveLength(2);
    expect(result[0].date).toBe("2026-03-10");
    expect(result[0].lessonLabel).toBe("L1");
    expect(result[1].date).toBe("2026-03-15");
    expect(result[1].lessonLabel).toBe("L2");
  });

  it("rounds lessonTotalScore to the nearest integer", () => {
    const lessons = [
      {
        lessonDate: "2026-03-10T10:00:00Z",
        lessonTotalScore: 74.6,
      },
    ];

    const result = buildLessonReadiness(lessons);

    expect(result[0].readiness).toBe(75);
    expect(typeof result[0].readiness).toBe("number");
  });

  it("excludes lessons without lessonTotalScore", () => {
    const lessons = [
      {
        lessonDate: "2026-03-10T10:00:00Z",
        lessonTotalScore: null,
      },
      {
        lessonDate: "2026-03-11T10:00:00Z",
      },
      {
        lessonDate: "2026-03-12T10:00:00Z",
        lessonTotalScore: 68,
      },
    ];

    const result = buildLessonReadiness(lessons);

    expect(result).toHaveLength(1);
    expect(result[0].date).toBe("2026-03-12");
    expect(result[0].readiness).toBe(68);
  });
});
