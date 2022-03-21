// Import CommandInteraction
import { CommandInteraction } from "discord.js";
// Import Knex
import { Knex } from "knex";

export const checkUserExists = (interaction: CommandInteraction, db: Knex, userId: string, guildId: string): void => {
  db("user")
    .select("*")
    .where("userId", userId)
    .andWhere("serverId", guildId)
    // @ts-ignore
    .then((user) => {
      if (user.length <= 0) {
        // Check if interaction has been replied to
        if (interaction.replied) {
          // If so, send channel message
          return interaction.channel?.send("You don't have a profile yet! Type `/profile` to create one!");
        }
        // If not, reply to interaction
        return interaction.reply("You don't have a profile yet! Type `/profile` to create one!");
      }
    });
};
