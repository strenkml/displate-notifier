import { ApplicationCommandType, ContextMenuCommandBuilder, Client, TextChannel } from "discord.js";

import * as config from "../../config/discord.json";
import Logger from "../Logger";

export const WATCH_COMMAND_NAME = "Watch Displate";

export async function registerCommands(client: Client): Promise<void> {
  const channel = client.channels.cache.get(config.channelId) as TextChannel;
  const guild = channel?.guild;
  if (!guild) {
    Logger.error("Unable to resolve guild for command registration", "registerCommands");
    return;
  }

  const watchCommand = new ContextMenuCommandBuilder()
    .setName(WATCH_COMMAND_NAME)
    .setType(ApplicationCommandType.Message);

  await guild.commands.set([watchCommand]);
  Logger.info("Registered guild commands", "registerCommands");
}
