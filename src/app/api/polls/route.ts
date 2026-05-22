import { NextResponse } from "next/server";
import { POLLS, chaosLevel, yesPercentage } from "@/lib/polls";
import { getAllTallies } from "@/lib/store";

export async function GET() {
  const tallies = getAllTallies();

  const polls = POLLS.map((poll) => {
    const { yes, no } = tallies[poll.id];
    return {
      ...poll,
      votes: { yes, no, total: yes + no },
      yesPct: yesPercentage(yes, no),
      chaos: chaosLevel(yes, no),
    };
  });

  return NextResponse.json({
    env: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
    polls,
  });
}
