import "dotenv/config";
import { ShardingManager } from "discord.js";
import log from "npmlog";

// Create a new ShardingManager
const manager = new ShardingManager("./bot.js", { token: process.env.TOKEN });

// Listen for shard events
manager.on("shardCreate", (shard) => {
  // Log shards
  log.info("", `Launched shard ${shard.id}`);
  // On shard error
  shard.on("error", (error) => {
    // Log error
    log.error("", `Shard ${shard.id} errored: ${error}`);
  });
});

// Spawn shards
manager.spawn({ amount: "auto" }).then();
