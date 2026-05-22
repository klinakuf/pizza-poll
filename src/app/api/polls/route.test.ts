import { beforeEach, describe, expect, it } from "vitest";
import { recordVote, resetAllVotes } from "@/lib/store";
import { GET } from "./route";

describe("GET /api/polls", () => {
  beforeEach(() => {
    resetAllVotes();
  });

  it("returns all polls with zero votes initially", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.polls).toHaveLength(5);
    expect(data.polls[0]).toMatchObject({
      id: expect.any(String),
      question: expect.any(String),
      votes: { yes: 0, no: 0, total: 0 },
      yesPct: 50,
      chaos: 0,
    });
  });

  it("includes env from NEXT_PUBLIC_APP_ENV when set", async () => {
    const previous = process.env.NEXT_PUBLIC_APP_ENV;
    process.env.NEXT_PUBLIC_APP_ENV = "ci";
    try {
      const data = await (await GET()).json();
      expect(data.env).toBe("ci");
    } finally {
      process.env.NEXT_PUBLIC_APP_ENV = previous;
    }
  });

  it("reflects recorded votes in poll stats", async () => {
    recordVote("fork-knife", "yes");
    recordVote("fork-knife", "yes");
    recordVote("fork-knife", "no");

    const poll = (await (await GET()).json()).polls.find(
      (p: { id: string }) => p.id === "fork-knife",
    );
    expect(poll.votes).toEqual({ yes: 2, no: 1, total: 3 });
    expect(poll.yesPct).toBe(67);
    expect(poll.chaos).toBe(33);
  });
});
