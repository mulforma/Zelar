// Import dotenv
require("dotenv")
  .config();
// Import ShardingManager from discord.js
const { ShardingManager } = require("discord.js");

// Create a new ShardingManager
const manager = new ShardingManager("./bot.js", { token: process.env.TOKEN });

// Listen for shard events
manager.on("shardCreate", (shard) => {
  // Log shards
  console.log(`Launched shard ${shard.id}`);
  // On shard error
  shard.on("error", (error) => {
    // Log error
    console.error(`Shard ${shard.id} errored: ${error}`);
  });
});

// Spawn shards
manager.spawn({ amount: "auto" });
