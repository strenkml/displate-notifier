import { Client, Interaction } from "discord.js";

import Logger from "../utils/Logger";
import db from "../providers/displate.database";
import { DisplateStatus } from "../models/DisplateItem";
import { WATCH_COMMAND_NAME } from "../utils/discord/commands";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isMessageContextMenuCommand()) {
      return;
    }

    if (interaction.commandName !== WATCH_COMMAND_NAME) {
      return;
    }

    const database = db.getInstance();
    const id = database.findIdByEmbedMessageId(interaction.targetId);

    if (!id) {
      await interaction.reply({ content: "This isn't a tracked Displate message.", ephemeral: true });
      return;
    }

    const item = database.getItem(id);

    if (item.info.status !== DisplateStatus.UPCOMING) {
      await interaction.reply({ content: "You can only watch upcoming Displates.", ephemeral: true });
      return;
    }

    const result = database.toggleWatcher(id, interaction.user.id);
    Logger.info(`User ${interaction.user.id} toggled watch on ${id}: ${result}`, "interactionCreate");

    if (result === "added") {
      await interaction.reply({
        content: "Watching — you'll get a channel ping 1 hour before member sale.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({ content: "No longer watching this Displate.", ephemeral: true });
    }
  });
};
