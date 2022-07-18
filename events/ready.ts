import { Client } from "discord.js";
import { ActivityType } from "discord-api-types/v10";
import log from "npmlog";

export default {
  name: "ready",
  description: "The ready event is fired when the bot is ready to start functioning.",
  once: true,
  run(client: Client) {
    // Set the bots' status
    client.user?.setActivity(`/help | ${client.guilds.cache.size} servers`, {
      type: ActivityType.Watching,
    });
    // Log when bot is ready
    log.info("", "Bot is ready!");
  },
};
