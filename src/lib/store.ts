import type { PollId, VoteChoice, VoteTally } from "./polls";
import { POLLS } from "./polls";

const tallies = new Map<PollId, VoteTally>();

function emptyTally(): VoteTally {
  return { yes: 0, no: 0 };
}

export function getAllTallies(): Record<PollId, VoteTally> {
  const result = {} as Record<PollId, VoteTally>;
  for (const poll of POLLS) {
    result[poll.id] = tallies.get(poll.id) ?? emptyTally();
  }
  return result;
}

export function recordVote(pollId: PollId, choice: VoteChoice): VoteTally {
  const current = tallies.get(pollId) ?? emptyTally();
  const updated = { ...current, [choice]: current[choice] + 1 };
  tallies.set(pollId, updated);
  return updated;
}

/** Reset votes — useful for local dev demos */
export function resetAllVotes(): void {
  tallies.clear();
}
