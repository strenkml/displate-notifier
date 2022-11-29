import { ActivityType, Client } from "discord.js";

import Logger from "../utils/Logger";
import Time from "../utils/Time";
import discord from "../utils/discord/discord";
import DisplateDB from "../providers/displate.database";
import { DisplateAPI } from "../providers/displate.api";
import { DisplateStatus } from "../models/DisplateItem";

export default (client: Client): void => {
  client.on("ready", async () => {
    Logger.info("Bot Online!", "clientReady");

    if (client.user) {
      client.user.setActivity("for Displates", { type: ActivityType.Watching });
    }

    setInterval(() => {
      tick(client);
    }, 1000);

    // Run once when starting the bot
    // runGrabber(client);
  });
};

function tick(client: Client) {
  const now = Time.getCurrentTime();
  const mins = now.getMinutes();
  if (mins == 0 && client.lastRun.getHours() != now.getHours()) {
    runGrabber(client);
    client.lastRun = now;
  }
}

export async function runGrabber(client: Client) {
  const db = DisplateDB.getInstance();

  const displateInfo = await DisplateAPI.getDisplateInfo();

  for (const info of displateInfo) {
    const id = info.itemCollectionId;
    if (db.hasItem(id)) {
      const dbItem = db.getItem(id);
      if (!db.isItemDeleted(id)) {
        // Edit the message with the updated data
        if (info.status == DisplateStatus.SOLD_OUT) {
          // Mark as deleted and delete the message
          db.markItemDeleted(id);
          try {
            discord.messages.deleteMessage(client, dbItem.embedMessageId);
          } catch (err) {
            Logger.error(`Error deleting embed message: ${dbItem.embedMessageId}`, "runGrabber");
          }
          try {
            discord.messages.deleteMessage(client, dbItem.mentionMessageId);
          } catch (err) {
            Logger.error(`Error deleting mention message: ${dbItem.mentionMessageId}`, "runGrabber");
          }
        } else {
          const newEmbed = discord.embeds.getDisplateEmbed(info);
          if (newEmbed) {
            discord.messages.editMessageEmbed(client, dbItem.embedMessageId, newEmbed);
          }
        }
        db.updateInfo(id, info);
      }
    } else {
      if (info.status == DisplateStatus.ACTIVE || info.status == DisplateStatus.UPCOMING) {
        const newEmbed = discord.embeds.getDisplateEmbed(info);
        if (newEmbed) {
          const mentionId = await discord.messages.mentionPingRole(client);
          const embedId = await discord.messages.sendEmbedToChannel(client, newEmbed);
          if (mentionId != undefined && embedId != undefined) {
            db.addItem(id, info, embedId, mentionId);
          }
        }
      }
    }
  }
}
