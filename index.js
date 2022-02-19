// Import dotenv
require("dotenv").config();
// Import ShardingManager from discord.js
const { ShardingManager } = require("discord.js");
// Import npmlog
const log = require("npmlog");

// Create a new ShardingManager
const manager = new ShardingManager("./bot.js", { token: process.env.TOKEN });

// Listen for shard events
manager.on("shardCreate", (shard) => {
  // Log shards
  log.info(`Launched shard ${shard.id}`);
  // On shard error
  shard.on("error", (error) => {
    // Log error
    log.error(`Shard ${shard.id} errored: ${error}`);
  });
});

// Spawn shards
manager.spawn({ amount: "auto" });
