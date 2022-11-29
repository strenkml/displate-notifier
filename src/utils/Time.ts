export default abstract class Time {
  static getCurrentTime(): Date {
    const timeElapsed = Date.now();
    return new Date(timeElapsed);
  }

  static getFormattedDate(): string {
    const time = this.getCurrentTime();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    const year = time.getFullYear();

    const hour = time.getHours();
    const minute = this.prefixZero(time.getMinutes());
    const second = this.prefixZero(time.getSeconds());
    const millisecond = time.getMilliseconds();
    return `${month}/${day}/${year} ${hour}:${minute}:${second}.${millisecond}`;
  }

  static prefixZero(number: number): number | string {
    if (number < 10) {
      return `0${number}`;
    }
    return number;
  }

  static timeSince(time: number): number {
    const currTime = this.getCurrentTime().getTime();
    const diff = currTime - time;
    if (diff < 0) {
      console.error("Given time is after the current time");
    }
    return diff;
  }

  static dateDifference(starting: Date, ending: Date): string {
    const start = starting.getTime();
    const end = ending.getTime();

    // get total seconds between the times
    let delta = Math.round(Math.abs(end - start) / 1000);

    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    const seconds = delta % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  private static timeToStartConverter(timeToStart: number): string {
    let delta = Math.round(timeToStart / 1000);

    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    const seconds = delta % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  static timeUntilMemberAccess(nonMemberTimeToStart: number): string {
    const memberTimeOffsetDays = 1.020833333333333; // 1 day and 30 minutes
    const memberTimeOffset = memberTimeOffsetDays * 86400000;

    const timeToStartAdjusted = nonMemberTimeToStart - memberTimeOffset;

    return this.timeToStartConverter(timeToStartAdjusted);
  }

  static timeUntilNonMemberAccess(nonMemberTimeToStart: number): string {
    return this.timeToStartConverter(nonMemberTimeToStart);
  }
}
