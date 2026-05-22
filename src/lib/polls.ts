export type PollId =
  | "pineapple"
  | "fork-knife"
  | "breakfast-pizza"
  | "ranch-dip"
  | "crust-first";

export type VoteChoice = "yes" | "no";

export interface PollDefinition {
  id: PollId;
  question: string;
  yesLabel: string;
  noLabel: string;
  emoji: string;
}

export const POLLS: PollDefinition[] = [
  {
    id: "pineapple",
    question: "Does pineapple belong on pizza?",
    yesLabel: "Absolutely 🍍",
    noLabel: "Crime scene 🚫",
    emoji: "🍍",
  },
  {
    id: "fork-knife",
    question: "Is it acceptable to eat pizza with a fork?",
    yesLabel: "Civilized 🍴",
    noLabel: "Fold it like NYC 🗽",
    emoji: "🍴",
  },
  {
    id: "breakfast-pizza",
    question: "Is cold pizza the best breakfast?",
    yesLabel: "Morning royalty 👑",
    noLabel: "Reheat gang 🔥",
    emoji: "🌅",
  },
  {
    id: "ranch-dip",
    question: "Should ranch be a default pizza dip?",
    yesLabel: "Ranch nation 🤠",
    noLabel: "Red flag 🚩",
    emoji: "🥛",
  },
  {
    id: "crust-first",
    question: "Do you eat the crust first?",
    yesLabel: "Chaos goblin 😈",
    noLabel: "Normal human ✅",
    emoji: "🌀",
  },
];

export interface VoteTally {
  yes: number;
  no: number;
}

export function getPollById(id: string): PollDefinition | undefined {
  return POLLS.find((p) => p.id === id);
}

export function isValidPollId(id: string): id is PollId {
  return POLLS.some((p) => p.id === id);
}

export function isValidVoteChoice(choice: string): choice is VoteChoice {
  return choice === "yes" || choice === "no";
}

/** 0 = calm debate, 100 = full pizza war */
export function chaosLevel(yes: number, no: number): number {
  const total = yes + no;
  if (total === 0) return 0;
  const yesPct = (yes / total) * 100;
  const split = Math.abs(yesPct - 50);
  return Math.round(Math.min(100, split * 2));
}

export function yesPercentage(yes: number, no: number): number {
  const total = yes + no;
  if (total === 0) return 50;
  return Math.round((yes / total) * 100);
}
