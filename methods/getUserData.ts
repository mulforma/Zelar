import { CommandInteraction } from "discord.js";

import { checkUserExists } from "./checkUserExists";

import { Knex } from "knex";

export const getUserData = (interaction: CommandInteraction, db: Knex, userId: string, guildId: string): any => {
  // Check if user exists
  checkUserExists(interaction, db, userId, guildId);
  // Get user data
  return db.select("*").from("user").where("userId", userId).andWhere("serverId", guildId).first();
};
