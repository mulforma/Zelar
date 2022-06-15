import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { InventoryItemData } from "../../types/InventoryItemData";
import { getInventory } from "../../methods/getInventory.js";

export default {
  data: new SlashCommandBuilder().setName("inventory").setDescription("View your current inventory."),
  category: "Profile",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get user inventory
    const result = await getInventory(interaction, interaction.user.id, interaction.guild!.id);
    // If there is no inventory
    if (!result) {
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
              result.items
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
  },
};
