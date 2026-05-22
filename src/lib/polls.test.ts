import { describe, expect, it } from "vitest";
import {
  POLLS,
  chaosLevel,
  getPollById,
  isValidPollId,
  isValidVoteChoice,
  yesPercentage,
} from "./polls";

describe("poll validation", () => {
  it("accepts known poll ids", () => {
    expect(isValidPollId("pineapple")).toBe(true);
    expect(isValidPollId("fake-poll")).toBe(false);
  });

  it("accepts yes/no votes only", () => {
    expect(isValidVoteChoice("yes")).toBe(true);
    expect(isValidVoteChoice("maybe")).toBe(false);
  });

  it("finds poll definitions", () => {
    expect(getPollById("ranch-dip")?.emoji).toBe("🥛");
  });

  it("returns undefined for unknown polls", () => {
    expect(getPollById("deep-dish")).toBeUndefined();
  });
});

describe("POLLS catalog", () => {
  it("defines exactly five debates", () => {
    expect(POLLS).toHaveLength(5);
  });

  it("uses unique poll ids", () => {
    const ids = POLLS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every poll a question and vote labels", () => {
    for (const poll of POLLS) {
      expect(poll.question.length).toBeGreaterThan(10);
      expect(poll.yesLabel.length).toBeGreaterThan(0);
      expect(poll.noLabel.length).toBeGreaterThan(0);
      expect(poll.emoji.length).toBeGreaterThan(0);
    }
  });
});

describe("chaosLevel", () => {
  it("returns 0 when nobody voted", () => {
    expect(chaosLevel(0, 0)).toBe(0);
  });

  it("returns 0 on a perfect 50/50 split", () => {
    expect(chaosLevel(50, 50)).toBe(0);
  });

  it("returns 100 when everyone agrees", () => {
    expect(chaosLevel(100, 0)).toBe(100);
    expect(chaosLevel(0, 80)).toBe(100);
  });

  it("rises as the split becomes one-sided", () => {
    expect(chaosLevel(75, 25)).toBe(50);
  });
});

describe("yesPercentage", () => {
  it("defaults to 50% with no votes", () => {
    expect(yesPercentage(0, 0)).toBe(50);
  });

  it("calculates yes share", () => {
    expect(yesPercentage(3, 1)).toBe(75);
  });
});
