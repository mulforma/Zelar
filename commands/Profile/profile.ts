import { SlashCommandBuilder } from "discord.js";
import { Client, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getItemData } from "../../methods/getItemData.js";
import { ShopItemData } from "../../types/ShopItemData";
import { prisma } from "../../prisma/connect.js";
import { createProfile } from "../../methods/createProfile.js";

export default {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Set up or view your profile.")
    .addUserOption((option) =>
      option.setName("target").setDescription("The target user to view the profile of.").setRequired(false),
    ),
  category: "Profile",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get user
    const { user } = interaction;
    // Get target
    const target = interaction.options.getUser("target");
    // Get user profile
    const profile = await prisma.user.findFirst({
      where: {
        userId: target ? target.id : user.id,
        serverId: interaction.guild!.id,
      },
    });

    // Check if profile exists
    if (!profile) {
      if (target) {
        return interaction.reply("This user has not set up a profile yet.");
      }
      await createProfile(interaction, interaction.id, interaction.guild!.id);
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
          new EmbedBuilder()
            .setTitle(`${(target || user).username}'s profile`)
            .setColor([0, 0, 255])
            .setThumbnail((target || user).displayAvatarURL())
            .addFields([
              { name: "🔼 Levels", value: String(profile.level) },
              { name: "✨ XPs", value: String(profile.xp) },
              { name: "💰 Coins", value: String(profile.coin) },
              {
                name: "🤑 Net Worth",
                value: (
                  Number(profile.coin) +
                  Number(
                    (profile.inventory! as { items: Array<any> })["items"].reduce(
                      (a: number, b: ShopItemData) => a + Number(b.price),
                      0,
                    ),
                  )
                ).toString(),
              },
              { name: "💼 Jobs", value: profile.jobs || "None" },
            ])
            .setFooter({
              text: `Requested by ${interaction.user.username}`,
              iconURL: interaction.user.avatarURL() ?? undefined,
            }),
        ],
      });
    }
  },
};
