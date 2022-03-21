// Import dotenv
import "dotenv/config";
// Import fs
import * as fs from "node:fs";
// Import REST
import { REST } from "@discordjs/rest";
// Import Routes
import { Routes } from "discord-api-types/v10";
// Import npmlog
import * as log from "npmlog";
// Command Array
const commands = [];
// Reading ./commands folder
const commandFolder = fs.readdirSync("./commands");
// Listing folder in ./commands
for (const folder of commandFolder) {
    // Filter file in folder to be .js
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith(".js"));
    // Listing file in commandFiles
    for (const file of commandFiles) {
        // Import command
        const command = await import(`./commands/${folder}/${file}`);
        // Push command in to Command Array
        commands.push(command.data.toJSON());
    }
}
// REST instance
const rest = new REST({ version: "9" }).setToken((process.env.NODE_ENV === "production" ? process.env.PROD_TOKEN : process.env.TOKEN));
// Auto execute
(async () => {
    try {
        // Log "Started refreshing application (/) commands."
        log.info("", "Started refreshing application (/) commands.");
        const applicationCommands = process.env.NODE_ENV === "production"
            ? Routes.applicationCommands(process.env.PROD_ClientId)
            : Routes.applicationGuildCommands(process.env.ClientId, process.env.GuildId);
        // Request put in Discord API
        await rest.put(
        /* This is for registering commands in development server only
         Use applicationCommands to deploy global commands instead
         It took 1 hour to loaded command if you deploy global commands
         But server commands will load immediately
         */
        applicationCommands, 
        // Send command to Discord API
        { body: commands });
        // Log successful response
        log.info("", "Successfully reloaded application (/) commands.");
    }
    catch (error) {
        // Catch error
        log.error("", error);
    }
})();
