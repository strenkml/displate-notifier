export default abstract class Sleep {
  private static sleep(time: number): Promise<unknown> {
    return new Promise((r) => setTimeout(r, time));
  }

  static sleepMilliSec(time: number): Promise<unknown> {
    return this.sleep(time);
  }

  static sleepSec(time: number): Promise<unknown> {
    return this.sleep(time * 1000);
  }

  static sleepMin(time: number): Promise<unknown> {
    return this.sleep(time * 60 * 1000);
  }
}
