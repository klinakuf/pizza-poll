import { beforeEach, describe, expect, it } from "vitest";
import { resetAllVotes } from "@/lib/store";
import { POST } from "./route";

function voteRequest(body: unknown): Request {
  return new Request("http://localhost/api/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/vote", () => {
  beforeEach(() => {
    resetAllVotes();
  });

  it("records a yes vote and returns tally stats", async () => {
    const res = await POST(voteRequest({ pollId: "pineapple", choice: "yes" }));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.pollId).toBe("pineapple");
    expect(data.question).toContain("pineapple");
    expect(data.votes).toEqual({ yes: 1, no: 0, total: 1 });
    expect(data.yesPct).toBe(100);
    expect(data.chaos).toBe(100);
  });

  it("accumulates votes on the same poll", async () => {
    await POST(voteRequest({ pollId: "ranch-dip", choice: "yes" }));
    const res = await POST(voteRequest({ pollId: "ranch-dip", choice: "no" }));
    const data = await res.json();
    expect(data.votes).toEqual({ yes: 1, no: 1, total: 2 });
    expect(data.yesPct).toBe(50);
    expect(data.chaos).toBe(0);
  });

  it("rejects invalid JSON", async () => {
    const res = await POST(
      new Request("http://localhost/api/vote", {
        method: "POST",
        body: "not-json",
      }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid JSON body" });
  });

  it("rejects unknown poll ids", async () => {
    const res = await POST(voteRequest({ pollId: "calzone", choice: "yes" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Unknown poll id" });
  });

  it("rejects invalid vote choices", async () => {
    const res = await POST(voteRequest({ pollId: "pineapple", choice: "maybe" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Choice must be yes or no" });
  });

  it("rejects missing fields", async () => {
    const res = await POST(voteRequest({ pollId: "pineapple" }));
    expect(res.status).toBe(400);
  });
});
