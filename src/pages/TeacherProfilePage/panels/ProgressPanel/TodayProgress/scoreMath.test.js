import { describe, expect, it } from "vitest";
import { mergeIntoProgressItems } from "./scoreMath";

describe("mergeIntoProgressItems", () => {
  it("overwrites an existing default zero with null", () => {
    const result = mergeIntoProgressItems(
      [{ id: "sightReading", label: "Sight Reading", weight: 14, score: 0 }],
      { sightReading: null },
    );

    expect(result[0].score).toBeNull();
  });

  it("overwrites an existing score with an explicit zero", () => {
    const result = mergeIntoProgressItems(
      [{ id: "sightReading", label: "Sight Reading", weight: 14, score: 80 }],
      { sightReading: 0 },
    );

    expect(result[0].score).toBe(0);
  });

  it("preserves a positive carried-forward score", () => {
    const result = mergeIntoProgressItems(
      [{ id: "auralTraining", label: "Aural Training", weight: 12, score: 0 }],
      { auralTraining: 76 },
    );

    expect(result[0].score).toBe(76);
  });

  it("does not add a missing item for a null score", () => {
    const result = mergeIntoProgressItems([], { sightReading: null });

    expect(result).toEqual([]);
  });

  it("merges piece and scales zero scores", () => {
    const result = mergeIntoProgressItems(
      [
        { id: "pieceA", label: "Piece A", weight: 20, score: 45 },
        { id: "scales", label: "Scales", weight: 14, score: 88 },
      ],
      { pieceA: 0, scales: 0 },
    );

    expect(result.map((item) => [item.id, item.score])).toEqual([
      ["pieceA", 0],
      ["scales", 0],
    ]);
  });

  it("merges positive piece and scales scores", () => {
    const result = mergeIntoProgressItems(
      [
        { id: "pieceA", label: "Piece A", weight: 20, score: 0 },
        { id: "scales", label: "Scales", weight: 14, score: 0 },
      ],
      { pieceA: 67, scales: 100 },
    );

    expect(result.map((item) => [item.id, item.score])).toEqual([
      ["pieceA", 67],
      ["scales", 100],
    ]);
  });
});
