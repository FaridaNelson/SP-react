import { describe, expect, it } from "vitest";
import {
  cycleIsActive,
  resolveCycleAfterRefresh,
} from "./teacherDashboardState";

function cycle(overrides = {}) {
  return {
    _id: "cycle-current",
    cycleStatus: "current",
    progressSummary: {
      readinessScore: 0,
      latestScores: {
        pieceA: 0,
        pieceB: 0,
        pieceC: 0,
        scales: 0,
        sightReading: 0,
        auralTraining: 0,
      },
    },
    ...overrides,
  };
}

describe("TeacherDashboard cycle refresh state", () => {
  it("returns selected current cycle X when the refreshed list also contains another active cycle", () => {
    const selectedCycle = cycle({
      _id: "cycle-x",
      progressSummary: {
        readinessScore: 0,
        latestScores: { pieceA: 0 },
      },
    });
    const refreshedSelectedCycle = cycle({
      _id: "cycle-x",
      progressSummary: {
        readinessScore: 31.86,
        latestScores: {
          pieceA: 20,
          pieceB: 40,
          pieceC: 60,
          scales: 29,
          sightReading: 10,
          auralTraining: 20,
        },
      },
    });
    const otherActiveCycle = cycle({
      _id: "cycle-other",
      progressSummary: {
        readinessScore: 84,
        latestScores: { pieceA: 84 },
      },
    });

    expect(
      resolveCycleAfterRefresh(
        [otherActiveCycle, refreshedSelectedCycle],
        selectedCycle,
      ),
    ).toBe(refreshedSelectedCycle);
  });

  it("returns selected registered cycle X by ID", () => {
    const selectedCycle = cycle({
      _id: "cycle-x",
      cycleStatus: "registered",
    });
    const refreshedSelectedCycle = cycle({
      _id: "cycle-x",
      cycleStatus: "registered",
      progressSummary: {
        readinessScore: 44,
        latestScores: { pieceA: 44 },
      },
    });

    expect(
      resolveCycleAfterRefresh([refreshedSelectedCycle], selectedCycle),
    ).toBe(refreshedSelectedCycle);
  });

  it("returns selected completed historical cycle Y by ID when present", () => {
    const selectedCycle = cycle({
      _id: "cycle-y",
      cycleStatus: "completed",
      progressSummary: {
        readinessScore: 62,
        latestScores: { pieceA: 62 },
      },
    });
    const refreshedSelectedCycle = cycle({
      _id: "cycle-y",
      cycleStatus: "completed",
      progressSummary: {
        readinessScore: 65,
        latestScores: { pieceA: 65 },
      },
    });
    const activeCurrentCycle = cycle({ _id: "cycle-current" });

    expect(
      resolveCycleAfterRefresh(
        [activeCurrentCycle, refreshedSelectedCycle],
        selectedCycle,
      ),
    ).toBe(refreshedSelectedCycle);
  });

  it("returns selected withdrawn historical cycle Y by ID when present", () => {
    const selectedCycle = cycle({
      _id: "cycle-y",
      cycleStatus: "withdrawn",
      progressSummary: {
        readinessScore: 62,
        latestScores: { pieceA: 62 },
      },
    });
    const refreshedSelectedCycle = cycle({
      _id: "cycle-y",
      cycleStatus: "withdrawn",
      progressSummary: {
        readinessScore: 66,
        latestScores: { pieceA: 66 },
      },
    });
    const activeCurrentCycle = cycle({ _id: "cycle-current" });

    expect(
      resolveCycleAfterRefresh(
        [activeCurrentCycle, refreshedSelectedCycle],
        selectedCycle,
      ),
    ).toBe(refreshedSelectedCycle);
  });

  it("preserves selected historical cycle Y when absent from the refreshed list", () => {
    const selectedCycle = cycle({
      _id: "cycle-y",
      cycleStatus: "completed",
      progressSummary: {
        readinessScore: 62,
        latestScores: { pieceA: 62 },
      },
    });
    const activeCurrentCycle = cycle({ _id: "cycle-current" });

    expect(resolveCycleAfterRefresh([activeCurrentCycle], selectedCycle)).toBe(
      selectedCycle,
    );
  });

  it("selects the active current or registered cycle when no cycle is selected", () => {
    const activeCurrentCycle = cycle({
      _id: "cycle-current",
      progressSummary: {
        readinessScore: 27,
        latestScores: { pieceA: 27 },
      },
    });
    const historicalCycle = cycle({
      _id: "cycle-history",
      cycleStatus: "completed",
      progressSummary: {
        readinessScore: 80,
        latestScores: { pieceA: 80 },
      },
    });

    expect(resolveCycleAfterRefresh([historicalCycle, activeCurrentCycle])).toBe(
      activeCurrentCycle,
    );
  });

  it("recognizes only current and registered cycles as active", () => {
    expect(cycleIsActive({ cycleStatus: "current" })).toBe(true);
    expect(cycleIsActive({ status: "registered" })).toBe(true);
    expect(cycleIsActive({ cycleStatus: "completed" })).toBe(false);
    expect(cycleIsActive({ cycleStatus: "withdrawn" })).toBe(false);
  });
});
