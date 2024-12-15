import { TIME_PERIOD } from "@/constants";

export const VOTING_START_TIME = new Date(
  Date.UTC(
    new Date().getUTCFullYear(),
    TIME_PERIOD.start.month - 1,
    TIME_PERIOD.start.day,
    TIME_PERIOD.start.hour - 7,
    TIME_PERIOD.start.minute,
    0,
    0
  )
);

export const VOTING_END_TIME = new Date(
  Date.UTC(
    new Date().getUTCFullYear(),
    TIME_PERIOD.end.month - 1,
    TIME_PERIOD.end.day,
    TIME_PERIOD.end.hour - 7,
    TIME_PERIOD.end.minute,
    0,
    0
  )
);

export function isVotingPeriod(currentTime: Date = new Date()): boolean {
  return currentTime >= VOTING_START_TIME && currentTime <= VOTING_END_TIME;
}
