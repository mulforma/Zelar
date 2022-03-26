import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { InventoryItemData } from "../../types/InventoryItemData";

export default {
  data: new SlashCommandBuilder().setName("inventory").setDescription("View your current inventory."),
  category: "Profile",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get user inventory
    client.db
      .select("inventory")
      .from("user")
      .where("userId", interaction.user.id)
      .then(async (result) => {
        // If there is no inventory
        if (result[0].inventory.length === 0) {
          // Reply with no inventory message
          await interaction.reply("You have no items in your inventory.");
        } else {
          // Reply with embeds whose show the inventory items
          await interaction.reply({
            embeds: [
              new MessageEmbed()
                .setAuthor({
                  iconURL: interaction.user.displayAvatarURL(),
                  name: `${interaction.user.username}'s inventory`,
                })
                .setDescription(
                  result[0].inventory.items
                    .map(
                      (item: InventoryItemData) =>
                        `${item.emoji} **${item.name}** — ${item.amount}\n*Item ID* \`${item.id}\` — ${
                          item.type.split(".")[0]
                        }`,
                    )
                    .join("\n\n"),
                )
                .setColor("GREEN")
                .setFooter({ text: "Use `/use <item>` to use an item." }),
            ],
          });
        }
      });
  },
};
