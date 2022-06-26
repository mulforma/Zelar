import { CommandInteraction } from "discord.js";
import { prisma } from "../prisma/connect.js";

export const checkUserExists = (interaction: CommandInteraction, userId: string, guildId: string): void => {
  const user = prisma.user.findFirst({
    where: {
      userId: BigInt(userId),
      serverId: BigInt(guildId),
    },
  });

  if (!user) {
    // Check if interaction has been replied to
    if (interaction.replied) {
      // If so, send channel message
      interaction.channel?.send("You don't have a profile yet! Type `/profile` to create one!");
    }
    // If not, reply to interaction
    interaction.reply("You don't have a profile yet! Type `/profile` to create one!");
  }
};
