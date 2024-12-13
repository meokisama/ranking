import { TIME_PERIOD } from "@/constants";

export const VOTING_START_TIME = new Date(
  TIME_PERIOD.start.year,
  TIME_PERIOD.start.month,
  TIME_PERIOD.start.day,
  TIME_PERIOD.start.hour,
  TIME_PERIOD.start.minute,
  TIME_PERIOD.start.second,
  TIME_PERIOD.start.millisecond
);

export const VOTING_END_TIME = new Date(
  TIME_PERIOD.end.year,
  TIME_PERIOD.end.month,
  TIME_PERIOD.end.day,
  TIME_PERIOD.end.hour,
  TIME_PERIOD.end.minute,
  TIME_PERIOD.end.second,
  TIME_PERIOD.end.millisecond
);

export function isVotingPeriod(currentTime: Date = new Date()): boolean {
  return currentTime >= VOTING_START_TIME && currentTime <= VOTING_END_TIME;
}
