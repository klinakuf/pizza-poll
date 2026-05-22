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
    <main className="page">
      <header className="header">
        <p className="envBadge">{envLabel}</p>
        <h1 className="title">🍕 Pizza Poll Lounge</h1>
        <p className="subtitle">Vote on cursed pizza opinions. Watch the chaos meter rise.</p>
      </header>

      {loading ? (
        <p className="loading">Heating the oven…</p>
      ) : (
        <ul className="pollList">
          {polls.map((poll) => (
            <li key={poll.id} className="pollCard">
              <div className="pollHeader">
                <span className="pollEmoji">{poll.emoji}</span>
                <h2 className="pollQuestion">{poll.question}</h2>
              </div>

              <div style={{ marginBottom: "0.85rem" }}>
                <div className="meta">
                  <span>Chaos level</span>
                  <span>{poll.chaos}% 🔥</span>
                </div>
                <div className="barTrack">
                  <div className="barFill barFillChaos" style={{ width: `${poll.chaos}%` }} />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div className="meta" style={{ fontSize: "0.85rem", marginBottom: 4 }}>
                  <span>{poll.yesLabel}</span>
                  <span>{poll.noLabel}</span>
                </div>
                <div className="voteTrack">
                  <div className="barFill barFillYes" style={{ width: `${poll.yesPct}%` }} />
                  <div className="voteCrust" />
                </div>
                <p className="voteMeta">
                  {poll.votes.total} vote{poll.votes.total === 1 ? "" : "s"} · {poll.yesPct}% yes
                </p>
              </div>

              <div className="buttonRow">
                <button
                  type="button"
                  className="btn btnYes"
                  disabled={voting === poll.id}
                  onClick={() => vote(poll.id, "yes")}
                >
                  {poll.yesLabel}
                </button>
                <button
                  type="button"
                  className="btn btnNo"
                  disabled={voting === poll.id}
                  onClick={() => vote(poll.id, "no")}
                >
                  {poll.noLabel}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <footer className="footer">CI/CD demo app — push a branch, run tests, deploy to Vercel 🚀</footer>
    </main>
  );
}
