import { EmbedBuilder } from "discord.js";
import { IDisplateInfo } from "../displate";

import Time from "../Time";

export function getDisplateEmbed(info: IDisplateInfo): EmbedBuilder {
  const embed = new EmbedBuilder();

  embed.setColor("Green");
  embed.setTitle("New Upcoming Limited Edition Displate");
  embed.setDescription(`Time until public release: ${info.availableWhen}`);
  embed.setImage(info.image);
  embed.setURL(info.url);
  embed.setTimestamp(Time.getCurrentTime());
  return embed;
}
