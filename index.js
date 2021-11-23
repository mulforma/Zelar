// Import modules
require('dotenv').config();
const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { table, getBorderCharacters } = require('table');

// Set table
const data = [];
// Set table config
/** @type {import('table').TableUserConfig}  */
const config = {
    border: getBorderCharacters('norc'),
    columns: [
        { width: 10, alignment: 'center' }, 
        { width: 10, alignment: 'center' }, 
        { width: 10, alignment: 'center' }
    ],
    header: {
        alignment: 'center',
        content: '\nLoaded commands\n'
    }
};

// Create new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Create command collection
client.commands = new Collection();

// Read folder 'commands'
const commandFolder = fs.readdirSync('./commands');

// List all folder in files
for (const folder of commandFolder) {
    // Filter for .js files
    const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith('.js'));

    // List all files in folder
    for (const file of commandFiles) {
    // Start timer
        const startTime = Date.now();

        // Import command
        const command = require(`./commands/${folder}/${file}`);
    
        // Push command to table
        data.push([
            command.category,
            command.data.name,
            Date.now() - startTime + 'ms'
        ]);
    
        // Set in collection
        client.commands.set(command.data.name, command);
    }
}

// Array of playing games
const Game = [
    'Overwatch',
    'Minecraft',
    'Valorant',
    'PUBG',
    'CS:GO',
    'Terraria',
    'Call of Duty Mobile',
    /* Add yours here */
];

// When client is ready
client.once('ready', () => {
    // Interval every 10 seconds
    setInterval(() => {
    // Set bot's presence 
        client.user.setPresence({
            activities: [
                {
                    // Random game name
                    name: Game[Math.floor(Math.random() * Game.length)],
                    // Presence type, see more (https://discord.js.org/#/docs/main/stable/typedef/ActivityType)
                    type: 'COMPETING'
                }
            ],
            status: 'online'
        });
    }, 10000);
    // Log loaded commands
    console.log(table(data, config));
    // Log when bot is ready
    console.log('Bot is ready!');
});

// When interaction is create
client.on('interactionCreate', async (interaction) => {
    // Check if interaction is command
    if (!interaction.isCommand()) return;

    // Search for existing commands
    const command = client.commands.get(interaction.commandName);

    /// If command is invalid, return
    if (!command) return;

    try {
    // Execute command
        await command.execute(client, interaction);
    } catch (error) {
    // Log when error
        console.error(error);
        // Send message to user
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
});

// Login to bot
client.login(process.env.TOKEN);
