import { INTERVAL } from "../solana/invest";

export class Time {
  static DILATION = 20;
  static DAY_SEC = 24 * 60 * 60;

  // in sec
  static now = () => {
    return Math.floor(new Date().getTime() / 1000);
  };

  static intervalTime = (interval: INTERVAL, intervalCount: number) => {
    if (interval === INTERVAL.DAY) {
      return Time.now() + intervalCount * Time.DAY_SEC;
    } else if (interval === INTERVAL.WEEK) {
      return Time.now() + intervalCount * Time.DAY_SEC * 7;
    } else {
      return Time.now() + intervalCount * Time.DAY_SEC * 30;
    }
  };
}
