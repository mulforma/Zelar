import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { getItemData } from "../../methods/getItemData.js";
import { ShopItemData } from "../../types/ShopItemData";
import { prisma } from "../../prisma/connect.js";

export default {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Set up or view your profile.")
    .addUserOption((option) =>
      option.setName("target").setDescription("The target user to view the profile of.").setRequired(false),
    ),
  category: "Profile",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get user
    const { user } = interaction;
    // Get target
    const target = interaction.options.getUser("target");
    // Get user profile
    const profile = await prisma.user.findFirst({
      where: {
        userId: BigInt(target ? target.id : user.id),
        serverId: BigInt(interaction.guild!.id),
      },
    });

    // Check if profile exists
    if (!profile) {
      if (target) {
        return interaction.reply("This user has not set up a profile yet.");
      }
      // Create profile
      await prisma.user.create({
        data: {
          userId: BigInt(user.id),
          serverId: BigInt(interaction.guild!.id),
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
      await interaction.reply("Your profile has been created.");
    } else {
      // Get all user items price
      for (const item of (profile.inventory! as { items: Array<any> })["items"]) {
        // Get item data
        const itemData = await getItemData("itemId", BigInt(item.id));
        // If there is no item data
        if (!itemData) {
          // Return
          return;
        }
        // Set item price
        item.price = itemData.price || 0;
      }
      // Send message
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`${(target || user).username}'s profile`)
            .setColor("BLUE")
            .setThumbnail((target || user).displayAvatarURL({ dynamic: true }))
            .addField("🔼 Levels", String(profile.level))
            .addField("✨ XPs", String(profile.xp))
            .addField("💰 Coins", String(profile.coin))
            .addField(
              "🤑 Net Worth",
              (
                Number(profile.coin) +
                Number(
                  (profile.inventory! as { items: Array<any> })["items"].reduce(
                    (a: number, b: ShopItemData) => a + Number(b.price),
                    0,
                  ),
                )
              ).toString(),
            )
            .addField("💼 Jobs", profile.jobs || "None")
            .setFooter({
              text: `Requested by ${interaction.user.username}`,
              iconURL: interaction.user.avatarURL() ?? undefined,
            }),
        ],
      });
    }
  },
};
