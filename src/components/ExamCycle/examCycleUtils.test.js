import { describe, it, expect } from "vitest";
import { sortCycles, buildLessonReadiness, DEFAULT_WEIGHTS } from "./examCycleUtils";

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

  it("single lesson with all elements returns one readiness point", () => {
    const lessons = [
      {
        lessonDate: "2026-03-10T10:00:00Z",
        pieces: [
          { pieceId: "pieceA", percent: 60 },
          { pieceId: "pieceB", percent: 80 },
          { pieceId: "pieceC", percent: 70 },
        ],
        scales: { percent: 75 },
        sightReading: { score: 50 },
        auralTraining: { score: 65 },
      },
    ];
    const result = buildLessonReadiness(lessons);
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe("2026-03-10");
  });

  it("two different dates produce two points, ordered chronologically", () => {
    const lessons = [
      {
        lessonDate: "2026-03-15T10:00:00Z",
        pieces: [{ pieceId: "pieceA", percent: 70 }],
        scales: { percent: 60 },
      },
      {
        lessonDate: "2026-03-10T10:00:00Z",
        pieces: [{ pieceId: "pieceB", percent: 50 }],
        scales: { percent: 40 },
      },
    ];
    const result = buildLessonReadiness(lessons);
    expect(result).toHaveLength(2);
    expect(result[0].date).toBe("2026-03-10");
    expect(result[1].date).toBe("2026-03-15");
  });

  it("readiness value is a number between 0 and 100 inclusive", () => {
    const lessons = [
      {
        lessonDate: "2026-03-10T10:00:00Z",
        pieces: [{ pieceId: "pieceA", percent: 45 }],
        scales: { percent: 90 },
      },
    ];
    const result = buildLessonReadiness(lessons);
    expect(result[0].readiness).toBeGreaterThanOrEqual(0);
    expect(result[0].readiness).toBeLessThanOrEqual(100);
    expect(typeof result[0].readiness).toBe("number");
  });

  it("lesson with null sightReading and auralTraining computes readiness from pieces and scales only", () => {
    const lessons = [
      {
        lessonDate: "2026-03-10T10:00:00Z",
        pieces: [
          { pieceId: "pieceA", percent: 80 },
          { pieceId: "pieceB", percent: 70 },
        ],
        scales: { percent: 60 },
        sightReading: null,
        auralTraining: null,
      },
    ];
    const result = buildLessonReadiness(lessons);
    expect(result).toHaveLength(1);
    expect(typeof result[0].readiness).toBe("number");
    expect(result[0].readiness).toBeGreaterThanOrEqual(0);
    expect(result[0].readiness).toBeLessThanOrEqual(100);
  });
});
