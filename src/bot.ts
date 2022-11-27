import { Client, GatewayIntentBits } from "discord.js";

import * as config from "./config/discord.json";

import ready from "./listeners/ready";

import Time from "./utils/Time";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
});

client.lastRun = Time.getCurrentTime();

ready(client);

client.login(config.token);
