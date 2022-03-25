// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import MessageEmbed
const { MessageEmbed } = require("discord.js");

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("inventory")
    // Set command description
    .setDescription("View your current inventory."),
  // Set command category
  category: "Profile",
  // Execute function
  async execute (client : Client, interaction : CommandInteraction) : Promise<void> {
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
                      (item) =>
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
