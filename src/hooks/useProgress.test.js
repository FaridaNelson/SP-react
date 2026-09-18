import { describe, expect, it } from "vitest";
import { getSubmittableScoreItems } from "./useProgress";

describe("useProgress score submission filtering", () => {
  it("includes zero and positive scores", () => {
    const result = getSubmittableScoreItems([
      { id: "sightReading", score: 0 },
      { id: "auralTraining", score: 82 },
    ]);

    expect(result.map((item) => item.id)).toEqual([
      "sightReading",
      "auralTraining",
    ]);
  });

  it("excludes null, undefined, and negative scores", () => {
    const result = getSubmittableScoreItems([
      { id: "sightReading", score: null },
      { id: "auralTraining", score: undefined },
      { id: "scales", score: -1 },
      { id: "pieceA", score: 74 },
    ]);

    expect(result.map((item) => item.id)).toEqual(["pieceA"]);
  });
});
