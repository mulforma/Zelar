import { CommandInteraction } from "discord.js";
import { checkUserExists } from "./checkUserExists.js";
import { prisma } from "../database/connect";

export const getUserData = (interaction: CommandInteraction, userId: string, guildId: string): any => {
  // Check if user exists
  checkUserExists(interaction, userId, guildId);
  // Get user data
  return prisma.user.findOne({ where: { userId, serverId: guildId } });
};
