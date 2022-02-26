// Import dotenv
require("dotenv").config();
// Import fs
const fs = require("fs");
// Import Client, Intents, and Collection from Discord.js
const { Client, Intents, Collection } = require("discord.js");
// Import Player from discord-player
const { Player } = require("discord-player");
// Import npmlog
const log = require("npmlog");
// Import knex
const knex = require("./database/connect");

// Create new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES],
});

// Create command collection
client.commands = new Collection();

// Initialize Player
client.player = new Player(client);

// Set db
client.db = knex;

// Read folder 'commands'
const commandFolder = fs.readdirSync("./commands");

// List all folder in files
for (const folder of commandFolder) {
  // Filter for .js files
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith(".js"));

  // List all files in folder
  for (const file of commandFiles) {
    // Import command
    const command = require(`./commands/${folder}/${file}`);

    // Log loaded command
    log.info("Loading commands...", `${command.data.name} loaded!`);

    client.commands.set(command.data.name, command);
  }
}

// Read folder 'events'
const eventFolder = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));

// List all folder in files
for (const file of eventFolder) {
  // Import event
  const event = require(`./events/${file}`);

  // Check if event is once
  if (event.once) {
    // Listen once
    client.once(event.name, async (...args) => event.run(client, ...args));
  } else {
    // Listen on
    client.on(event.name, (...args) => event.run(client, ...args));
  }
}

// Read folder 'player'
const playerFolder = fs.readdirSync("./player").filter((file) => file.endsWith(".js"));

// List all folder in files
for (const file of playerFolder) {
  // Import event
  const event = require(`./player/${file}`);

  // Listen on
  client.player.on(event.name, (...args) => event.run(...args));
}

// Login to bot
client.login(process.env.NODE_ENV === "production" ? process.env.PROD_TOKEN : process.env.TOKEN);
