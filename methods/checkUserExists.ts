import { ChatInputCommandInteraction } from "discord.js";
import { prisma } from "../prisma/connect.js";
import { createProfile } from "./createProfile.js";

export const checkUserExists = async (
  interaction: ChatInputCommandInteraction,
  userId: string,
  guildId: string,
): Promise<any> => {
  const user = await prisma.user.findFirst({
    where: {
      userId: userId,
      serverId: guildId,
    },
  });

  if (!user) return createProfile(interaction, userId, guildId);
};
