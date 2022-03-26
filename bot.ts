import "dotenv/config";
import * as fs from "fs";
import { Client, Intents, Collection } from "discord.js";
import { Player } from "discord-player";
import log from "npmlog";
import { knex } from "./database/connect";
import { CommandData } from "./types/CommandData";

// Create new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES],
});

// Create command collection
client.commands = new Collection();

// Initialize Player
client.player = new Player(client);

// Set db
// @ts-ignore
client.db = knex;

// Read folder 'commands'
const commandFolder = fs.readdirSync("./commands");

// List all folder in files
for (const folder of commandFolder) {
  // Filter for .js files
  const commandFiles: Array<String> = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith(".ts"));

  // List all files in folder
  for (const file of commandFiles) {
    import(`./commands/${folder}/${file}`).then((command: CommandData) => {
      // Log loaded command
      log.info("Loading commands...", `${command.data.name} loaded!`);
      client.commands.set(command.data.name, command);
    });
  }
}

// Read folder 'events'
const eventFolder = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));

// List all folder in files
for (const file of eventFolder) {
  import(`./events/${file}`).then((event) => {
    // Check if event is once
    if (event.once) {
      // Listen once
      client.once(event.name, async (...args) => event.run(client, ...args));
    } else {
      // Listen on
      client.on(event.name, (...args) => event.run(client, ...args));
    }
  });
}

// Read folder 'player'
const playerFolder = fs.readdirSync("./players").filter((file) => file.endsWith(".js"));

// List all folder in files
for (const file of playerFolder) {
  import(`./players/${file}`).then((player) => {
    // Listen on
    client.player.on(player.name, (...args: any) => player.run(...args));
  });
}

// Login to bot
client.login(process.env.NODE_ENV === "production" ? process.env.PROD_TOKEN : process.env.TOKEN).then();
