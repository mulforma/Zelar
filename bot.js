// Import modules
require("dotenv")
  .config();
const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js");

// Create new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Create command collection
client.commands = new Collection();

// Read folder 'commands'
const commandFolder = fs.readdirSync("./commands");

// List all folder in files
for (const folder of commandFolder) {
  // Filter for .js files
  const commandFiles = fs.readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  
  // List all files in folder
  for (const file of commandFiles) {
    
    // Import command
    const command = require(`./commands/${folder}/${file}`);
    
    // Set in collection
    client.commands.set(command.data.name, command);
  }
}

// Read folder 'events'
const eventFolder = fs.readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

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

// Login to bot
client.login(process.env.TOKEN);
