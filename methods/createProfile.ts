import { CommandInteraction } from "discord.js";
import { prisma } from "../prisma/connect.js";

export const createProfile = async (interaction: CommandInteraction, userId: string, guildId: string): Promise<any> => {
  // Create profile
  await prisma.user.create({
    data: {
      userId: userId,
      serverId: guildId,
      level: 1,
      xp: 0,
      coin: 0,
      inventory: {
        items: [
          {
            amount: 1,
            description: "Redeem this for 1,000 coins",
            emoji: "<:wumpcoin:889984011865292800>",
            id: "738262744737972226",
            name: "$2000 Coupon",
            rarity: "Very rare",
            type: "Collectable.Coupon",
            usable: true,
          },
        ],
      },
      timeout: { commands: [], daily: 0, weekly: 0 },
    },
  });
  // Send message
  return interaction.reply("Your profile has been created.");
};
