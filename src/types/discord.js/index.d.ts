import { SlashCommand } from "@strenkml/discordjs-utils";
export { };

declare module "discord.js" {
  export interface Client {
    lastRun: Date,
    slashCommands: Collection<string, SlashCommand>;
  }
}
