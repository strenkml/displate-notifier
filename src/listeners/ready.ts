import { ActivityType, Client } from "discord.js";

import Logger from "../utils/Logger";
import Time from "../utils/Time";
import * as displate from "../utils/displate";
import discord from "../utils/discord/discord";
import DisplateDB from "../providers/displate.database";

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
    runScrapper(client);
  });
};

function tick(client: Client) {
  const now = Time.getCurrentTime();
  const mins = now.getMinutes();
  if (mins == 0 && client.lastRun.getHours() != now.getHours()) {
    runScrapper(client);
    client.lastRun = now;
  }
}

async function runScrapper(client: Client) {
  const displateInfo = await displate.fetchNewComingSoons();
  const db = DisplateDB.getInstance();

  for (const [key, value] of displateInfo) {
    if (!db.hasId(key)) {
      db.addId(key);
      discord.messages.mentionPingRole(client);
      discord.messages.sendEmbedToChannel(client, discord.embeds.getDisplateEmbed(value));
    }
  }
}
