import { Client, Message } from "discord.js";

import Logger from "../utils/Logger";
import db from "../providers/displate.database";

import { runGrabber } from "./ready";

export default (client: Client): void => {
  client.on("messageCreate", async (message: Message) => {
    if (message.content.startsWith(",")) {
      const command = message.content.slice(1);

      if (command == "displateWipe") {
        Logger.info("Wipe command called!", "messageCreate");
        db.getInstance().wipe();
        // message.reply("Database Wiped!");
        Logger.info("Deleting caller command", "messageCreate");
        message.delete();
      } else if (command == "displateRun") {
        Logger.info("Manually running grabber", "messageCreate");
        // message.reply("Manually running grabber");
        runGrabber(client);
        Logger.info("Deleting caller command", "messageCreate");
        message.delete();
      }
    }
  });
};
