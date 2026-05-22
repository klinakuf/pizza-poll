"use client";

import { useCallback, useEffect, useState } from "react";

interface PollData {
  id: string;
  question: string;
  yesLabel: string;
  noLabel: string;
  emoji: string;
  votes: { yes: number; no: number; total: number };
  yesPct: number;
  chaos: number;
}

export default function Home() {
  const [polls, setPolls] = useState<PollData[]>([]);
  const [env, setEnv] = useState("development");
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);

  const loadPolls = useCallback(async () => {
    const res = await fetch("/api/polls");
    const data = await res.json();
    setPolls(data.polls);
    setEnv(data.env);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  async function vote(pollId: string, choice: "yes" | "no") {
    setVoting(pollId);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId, choice }),
      });
      if (!res.ok) return;
      await loadPolls();
    } finally {
      setVoting(null);
    }
  }

  const envLabel =
    env === "production" ? "🍕 Production Oven" : env === "preview" ? "👀 Preview Slice" : "🛠️ Local Kitchen";

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>
      <header style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <p
          style={{
            display: "inline-block",
            margin: "0 0 1rem",
            padding: "0.35rem 0.85rem",
            borderRadius: 999,
            background: "rgba(255, 213, 79, 0.15)",
            border: "1px solid var(--cheese)",
            fontSize: "0.85rem",
          }}
        >
          {envLabel}
        </p>
        <h1 style={{ fontSize: "2.4rem", margin: "0 0 0.5rem", lineHeight: 1.15 }}>
          🍕 Pizza Poll Lounge
        </h1>
        <p style={{ color: "var(--muted)", margin: 0, fontSize: "1.05rem" }}>
          Vote on cursed pizza opinions. Watch the chaos meter rise.
        </p>
      </header>

      {loading ? (
        <p style={{ textAlign: "center", color: "var(--muted)" }}>Heating the oven…</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {polls.map((poll) => (
            <li
              key={poll.id}
              style={{
                background: "var(--card)",
                border: "2px solid var(--card-border)",
                borderRadius: 16,
                padding: "1.25rem 1.35rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.75rem" }}>{poll.emoji}</span>
                <h2 style={{ margin: 0, fontSize: "1.15rem", flex: 1 }}>{poll.question}</h2>
              </div>

              <div style={{ marginBottom: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--muted)" }}>
                  <span>Chaos level</span>
                  <span>{poll.chaos}% 🔥</span>
                </div>
                <div
                  style={{
                    height: 8,
                    borderRadius: 4,
                    background: "#3d2218",
                    overflow: "hidden",
                    marginTop: 4,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${poll.chaos}%`,
                      background: `linear-gradient(90deg, var(--cheese), var(--sauce))`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 4 }}>
                  <span>{poll.yesLabel}</span>
                  <span>{poll.noLabel}</span>
                </div>
                <div style={{ height: 10, borderRadius: 5, background: "#3d2218", overflow: "hidden", display: "flex" }}>
                  <div style={{ width: `${poll.yesPct}%`, background: "var(--sauce)", transition: "width 0.3s ease" }} />
                  <div style={{ flex: 1, background: "var(--crust)" }} />
                </div>
                <p style={{ margin: "0.4rem 0 0", fontSize: "0.8rem", color: "var(--muted)" }}>
                  {poll.votes.total} vote{poll.votes.total === 1 ? "" : "s"} · {poll.yesPct}% yes
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button
                  type="button"
                  disabled={voting === poll.id}
                  onClick={() => vote(poll.id, "yes")}
                  style={buttonStyle("yes")}
                >
                  {poll.yesLabel}
                </button>
                <button
                  type="button"
                  disabled={voting === poll.id}
                  onClick={() => vote(poll.id, "no")}
                  style={buttonStyle("no")}
                >
                  {poll.noLabel}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <footer style={{ marginTop: "2.5rem", textAlign: "center", color: "var(--muted)", fontSize: "0.85rem" }}>
        CI/CD demo app — push a branch, run tests, deploy to Vercel 🚀
      </footer>
    </main>
  );
}

function buttonStyle(variant: "yes" | "no"): React.CSSProperties {
  return {
    flex: 1,
    padding: "0.65rem 0.5rem",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
    background: variant === "yes" ? "var(--sauce)" : "var(--crust)",
    color: variant === "yes" ? "#fff" : "#2d1810",
  };
}
