/* -------------------------------------------------------------------------- */
/*                                Setup Stumper                                */
/* -------------------------------------------------------------------------- */
import Stumper, { LOG_LEVEL, TIMEZONE } from "stumper";
Stumper.setConfig({ logLevel: LOG_LEVEL.ALL, useColors: false, timezone: TIMEZONE.LOCAL });

/* -------------------------------------------------------------------------- */
/*                        Setup Process Error Handling                        */
/* -------------------------------------------------------------------------- */
import processErrorHandling from "./listeners/processErrorHandling";

processErrorHandling();

/* -------------------------------------------------------------------------- */
/*                            Setup SigINT handling                           */
/* -------------------------------------------------------------------------- */
import onSigInt from "./listeners/onSigInt";

onSigInt();

/* -------------------------------------------------------------------------- */
/*                          Initialize Health Manager                         */
/* -------------------------------------------------------------------------- */
import { BotHealthManager, onInteractionCreate, onReady, Time } from "@strenkml/discordjs-utils";
BotHealthManager.getInstance();

/* -------------------------------------------------------------------------- */
/*                            Create Discord Client                           */
/* -------------------------------------------------------------------------- */

import { Client, Collection, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

/* -------------------------------------------------------------------------- */
/*                        Setup Discord Error Handling                        */
/* -------------------------------------------------------------------------- */
import discordErrorHandling from "./listeners/discordErrorHandling";

discordErrorHandling(client);

/* -------------------------------------------------------------------------- */
/*                       Setup Collections for commands                       */
/* -------------------------------------------------------------------------- */
client.slashCommands = new Collection();

/* -------------------------------------------------------------------------- */
/*                               Setup Managers                               */
/* -------------------------------------------------------------------------- */
import { ClientManager, SlashCommandManager } from "@strenkml/discordjs-utils";
import Config from "./config/Config";

ClientManager.getInstance(client);
SlashCommandManager.getInstance();

/* -------------------------------------------------------------------------- */
/*                                 Run Startup                                */
/* -------------------------------------------------------------------------- */
startUp();

async function startUp(): Promise<void> {
  client.lastRun = Time.getCurrentTime();

  /* -------------------------------------------------------------------------- */
  /*                      Register Our Other Event Handlers                     */
  /* -------------------------------------------------------------------------- */
  onInteractionCreate(client);
  onReady(client);

  /* -------------------------------------------------------------------------- */
  /*                                Log into bot                                */
  /* -------------------------------------------------------------------------- */
  client.login(Config.getConfig().token);
}
