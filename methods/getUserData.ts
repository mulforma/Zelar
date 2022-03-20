// Import CommandInteraction
import { CommandInteraction } from "discord.js";
// Import checkUserExists
import { checkUserExists } from "./checkUserExists";
// Import Knex
import { Knex } from "knex";

export const getUserData = (interaction: CommandInteraction, db: Knex, userId: number, guildId: number): any => {
  // Check if user exists
  checkUserExists(interaction, db, userId, guildId);
  // Get user data
  return db.select("*").from("user").where("userId", userId).andWhere("serverId", guildId).first();
};
