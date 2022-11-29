import { Client, GatewayIntentBits } from "discord.js";

import * as config from "./config/discord.json";

import ready from "./listeners/ready";
import messageCreate from "./listeners/messageCreate";

import Time from "./utils/Time";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

client.lastRun = Time.getCurrentTime();

ready(client);
messageCreate(client);

client.login(config.token);
