import "dotenv/config";
import * as fs from "node:fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import log from "npmlog";

// Command Array
const commands = [];
// Reading ./commands folder
const commandFolder: Array<String> = fs.readdirSync("./commands");

// Listing folder in ./commands
for (const folder of commandFolder) {
  // Filter file in folder to be .js
  const commandFiles: Array<String> = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith(".js"));

  // Listing file in commandFiles
  for (const file of commandFiles) {
    const command = await import(`./commands/${folder}/${file}`);
    // Push command in to Command Array
    commands.push(command.data.toJSON());
  }
}

// REST instance
const rest = new REST({ version: "9" }).setToken(
  <string>(process.env.NODE_ENV === "production" ? process.env.PROD_TOKEN : process.env.TOKEN),
);

// Auto execute
try {
  // Log "Started refreshing application (/) commands."
  log.info("", "Started refreshing application (/) commands.");

  const applicationCommands =
      process.env.NODE_ENV === "production"
        ? Routes.applicationCommands(<string>process.env.PROD_ClientId)
        : Routes.applicationGuildCommands(<string>process.env.ClientId, <string>process.env.GuildId);

  // Request put in Discord API
  await rest.put(
    /* This is for registering commands in development server only
       Use applicationCommands to deploy global commands instead
       It took 1 hour to loaded command if you deploy global commands
       But server commands will load immediately
       */
    applicationCommands,
    // Send command to Discord API
    { body: commands },
  );

  // Log successful response
  log.info("", "Successfully reloaded application (/) commands.");
} catch (error) {
  // Catch error
  log.error("", <string>error);
}
