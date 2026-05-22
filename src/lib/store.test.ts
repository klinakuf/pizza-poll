import { beforeEach, describe, expect, it } from "vitest";
import { POLLS } from "./polls";
import { getAllTallies, recordVote, resetAllVotes } from "./store";

describe("vote store", () => {
  beforeEach(() => {
    resetAllVotes();
  });

  it("starts with zero votes on every poll", () => {
    const tallies = getAllTallies();
    for (const poll of POLLS) {
      expect(tallies[poll.id]).toEqual({ yes: 0, no: 0 });
    }
  });

  it("increments yes votes", () => {
    const tally = recordVote("pineapple", "yes");
    expect(tally).toEqual({ yes: 1, no: 0 });
    expect(getAllTallies().pineapple).toEqual({ yes: 1, no: 0 });
  });

  it("increments no votes", () => {
    recordVote("ranch-dip", "no");
    recordVote("ranch-dip", "no");
    expect(getAllTallies()["ranch-dip"]).toEqual({ yes: 0, no: 2 });
  });

  it("keeps tallies independent per poll", () => {
    recordVote("pineapple", "yes");
    recordVote("crust-first", "no");
    const tallies = getAllTallies();
    expect(tallies.pineapple).toEqual({ yes: 1, no: 0 });
    expect(tallies["crust-first"]).toEqual({ yes: 0, no: 1 });
    expect(tallies["fork-knife"]).toEqual({ yes: 0, no: 0 });
  });

  it("clears all votes on reset", () => {
    recordVote("pineapple", "yes");
    recordVote("ranch-dip", "no");
    resetAllVotes();
    expect(getAllTallies().pineapple).toEqual({ yes: 0, no: 0 });
    expect(getAllTallies()["ranch-dip"]).toEqual({ yes: 0, no: 0 });
  });
});
