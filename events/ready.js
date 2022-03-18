// Array of playing games
const Game = [
  "Overwatch",
  "Minecraft",
  "Valorant",
  "PUBG",
  "CS:GO",
  "Terraria",
  "Call of Duty Mobile",
  /* Add more here */
];
// Import npmlog
const /**@type npmlog */ log = require("npmlog");

module.exports = {
  name: "ready",
  description: "The ready event is fired when the bot is ready to start functioning.",
  once: true,
  run(client) {
    // Interval every 10 seconds
    setInterval(() => {
      // Set bots presence
      client.user.setPresence({
        activities: [
          {
            // Random game name
            name: Game[Math.floor(Math.random() * Game.length)],
            // Presence type, see more (https://discord.js.org/#/docs/main/stable/typedef/ActivityType)
            type: "COMPETING",
          },
        ],
        status: "online",
      });
    }, 10000);
    // Log when bot is ready
    log.info("Bot is ready!");
  },
};
