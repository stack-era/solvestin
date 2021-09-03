import { INTERVAL, intervalString } from "../solana/invest";

const DAY_SEC = 24 * 60 * 60;

export const calcStreamDuration = (
  startTimeSec: number,
  endTimeSec: number,
  interval: INTERVAL
) => {
  const divFactor =
    interval === INTERVAL.DAY
      ? DAY_SEC
      : interval === INTERVAL.WEEK
      ? DAY_SEC * 7
      : DAY_SEC * 30;

  return `${(endTimeSec - startTimeSec) / divFactor} ${intervalString(
    interval
  )}'s`;
};
