import { TextChannel, EmbedBuilder, Client } from "discord.js";

import * as config from "../../config/discord.json";
import Logger from "../Logger";

export async function sendEmbedToChannel(client: Client, embed: EmbedBuilder): Promise<string | undefined> {
  const channel = client.channels.cache.get(config.channelId) as TextChannel;
  if (channel) {
    Logger.info(`Sending embed to channel: ${config.channelId}`, "sendEmbedToChannel");
    const msg = await channel?.send({ embeds: [embed] });
    return msg.id;
  }
  return undefined;
}

export function mentionPingRole(client: Client) {
  const channel = client.channels.cache.get(config.channelId) as TextChannel;
  Logger.info(`Sending mention to channel: ${channel.id}`, "mentionPingRole");
  channel?.send(`<@&${config.roleId}>`);
}
