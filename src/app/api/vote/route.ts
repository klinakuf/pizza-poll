import { NextResponse } from "next/server";
import {
  chaosLevel,
  getPollById,
  isValidPollId,
  isValidVoteChoice,
  yesPercentage,
} from "@/lib/polls";
import { recordVote } from "@/lib/store";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { pollId, choice } = body as { pollId?: string; choice?: string };

  if (!pollId || !isValidPollId(pollId)) {
    return NextResponse.json({ error: "Unknown poll id" }, { status: 400 });
  }

  if (!choice || !isValidVoteChoice(choice)) {
    return NextResponse.json({ error: "Choice must be yes or no" }, { status: 400 });
  }

  const tally = recordVote(pollId, choice);
  const poll = getPollById(pollId)!;

  return NextResponse.json({
    pollId,
    question: poll.question,
    votes: { yes: tally.yes, no: tally.no, total: tally.yes + tally.no },
    yesPct: yesPercentage(tally.yes, tally.no),
    chaos: chaosLevel(tally.yes, tally.no),
  });
}
