import { EmbedBuilder } from "discord.js";
import DisplateItem, { DisplateFormat, DisplateStatus, DisplateType } from "../../models/DisplateItem";

import Time from "../Time";
import Logger from "../Logger";

export function getDisplateEmbed(info: DisplateItem): EmbedBuilder | undefined {
  const embed = new EmbedBuilder();

  // Exit if any of the enums are unknown
  if (
    info.status == DisplateStatus.UNKNOWN ||
    info.type == DisplateType.UNKNOWN ||
    info.format == DisplateFormat.UNKNOWN
  ) {
    Logger.warning(
      `Id: ${info.itemCollectionId}  Status: ${info.status}  Type: ${info.type}  Format: ${info.format}`,
      "enumUnknown"
    );
    return undefined;
  }

  // Set the color
  if (info.type == DisplateType.ULTRA) {
    embed.setColor("Red");
  } else if (info.status == DisplateStatus.ACTIVE) {
    embed.setColor("Green");
  } else if (info.status == DisplateStatus.UPCOMING) {
    embed.setColor("Blue");
  } else {
    embed.setColor("White");
  }

  // Set the title
  if (info.type == DisplateType.ULTRA) {
    embed.setTitle("Ultra Limited Edition");
  } else {
    embed.setTitle("Standard Limited Edition");
  }

  // Set the description
  let description: string;
  if (info.status == DisplateStatus.ACTIVE) {
    description = `${info.title}\nACTIVE`;
  } else if (info.status == DisplateStatus.UPCOMING) {
    description = `${info.title}\nUPCOMING`;
  } else {
    description = `${info.title}\nSOLD OUT`;
  }
  embed.setDescription(description);

  // Set the image
  embed.setImage(info.imageUrl);

  // Set the URL
  embed.setURL(`https://displate.com${info.url}`);

  // Set the availability field
  embed.addFields({ name: "Availability", value: `${info.numberAvailable}/${info.initialAvailable}` });

  // Set the timeleft/timeTilRelease
  if (info.status == DisplateStatus.ACTIVE) {
    embed.addFields({ name: "Time left", value: Time.dateDifference(Time.getCurrentTime(), info.endDate) });
  } else if (info.status == DisplateStatus.UPCOMING) {
    embed.addFields({ name: "Time until start(member)", value: Time.timeUntilMemberAccess(info.timeToStart) });
    embed.addFields({ name: "Time until start(non-member)", value: Time.timeUntilNonMemberAccess(info.timeToStart) });
  }

  // Set the format field
  let format: string;
  if (info.format == DisplateFormat.MEDIUM) {
    format = "Medium";
  } else if (info.format == DisplateFormat.LARGE) {
    format = "Large";
  } else {
    format = "Extra Large";
  }
  embed.addFields({ name: "Format", value: format });

  // Set the timestamp
  embed.setTimestamp(Time.getCurrentTime());

  return embed;
}
// export function getDisplateEmbed(info: DisplateItem): EmbedBuilder {
//   const embed = new EmbedBuilder();

//   embed.setColor("Green");
//   embed.setTitle("New Upcoming Limited Edition Displate");
//   embed.setDescription(`Time until public release: ${info.availableWhen}`);
//   embed.setImage(info.image);
//   embed.setURL(info.url);
//   embed.setTimestamp(Time.getCurrentTime());
//   return embed;
// }
