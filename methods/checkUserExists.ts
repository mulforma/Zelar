import { CommandInteraction } from "discord.js";
import { prisma } from "../prisma/connect.js";
import { createProfile } from "./createProfile.js";

export const checkUserExists = async (
  interaction: CommandInteraction,
  userId: string,
  guildId: string,
): Promise<void> => {
  const user = await prisma.user.findFirst({
    where: {
      userId: BigInt(userId),
      serverId: BigInt(guildId),
    },
  });

  if (!user) return createProfile(interaction, userId, guildId);
};
