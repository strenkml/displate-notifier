import { TextChannel, EmbedBuilder, Client, Message } from "discord.js";

import * as config from "../../config/discord.json";
import Logger from "../Logger";

export async function sendEmbedToChannel(client: Client, embed: EmbedBuilder): Promise<string | undefined> {
  const channel = client.channels.cache.get(config.channelId) as TextChannel;
  if (channel) {
    Logger.info(`Sending embed to channel: ${config.channelId}`, "sendEmbedToChannel");
    const msg = await channel.send({ embeds: [embed] });
    return msg.id;
  }
  return undefined;
}

export async function mentionPingRole(client: Client): Promise<string | undefined> {
  const channel = client.channels.cache.get(config.channelId) as TextChannel;
  if (channel) {
    Logger.info(`Sending mention to channel: ${channel.id}`, "mentionPingRole");
    const msg = await channel.send(`<@&${config.roleId}>`);
    return msg.id;
  }
  return undefined;
}

export async function editMessageEmbed(client: Client, messageId: string, newEmbed: EmbedBuilder): Promise<boolean> {
  const channel = client.channels.cache.get(config.channelId) as TextChannel;
  let message: Message;
  try {
    message = await channel.messages.fetch(messageId);
    message.edit({ embeds: [newEmbed] });
    return true;
  } catch (err) {
    Logger.error(`Error retrieving message from id: ${messageId}.  Error: ${err}`, "editMessageEmbed");
  }
  return false;
}

export async function deleteMessage(client: Client, messageId: string): Promise<boolean> {
  const channel = client.channels.cache.get(config.channelId) as TextChannel;
  let message: Message;
  try {
    message = await channel.messages.fetch(messageId);
    message.delete();
    return true;
  } catch (err) {
    Logger.error(`Error retrieving message from id: ${messageId}.  Error: ${err}`, "deleteMessage");
  }
  return false;
}
