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
}
