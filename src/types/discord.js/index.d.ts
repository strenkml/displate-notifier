export {};

declare module "discord.js" {
  export interface Client {
      lastRun: Date
  }
}
