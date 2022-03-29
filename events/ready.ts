import { Client } from "discord.js";
import log from "npmlog";

export default {
  name: "ready",
  description: "The ready event is fired when the bot is ready to start functioning.",
  once: true,
  run(client: Client) {
    // Set the bots' status
    client.user?.setActivity({
      name: `/help | ${client.guilds.cache.size} servers`,
      type: "WATCHING",
    });
    // Log when bot is ready
    log.info("", "Bot is ready!");
  },
};
