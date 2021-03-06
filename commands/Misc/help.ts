import { Colors, SlashCommandBuilder } from "discord.js";
import { Client, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { CommandData } from "../../types/CommandData";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows a list of commands.")
    .addSubcommand((subcommand) => subcommand.setName("all").setDescription("Shows a list of all commands."))
    .addSubcommand((subcommand) =>
      subcommand
        .setName("command")
        .setDescription("Shows specific command information.")
        .addStringOption((command) =>
          command.setName("command").setDescription("The command to show information for.").setRequired(true),
        ),
    ),
  category: "Misc",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get all command categories
    const categories = new Set(client.commands.map((c) => c.category));
    // Get subcommand
    const subcommand = interaction.options.getSubcommand();

    // Create embed
    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle("Zelar")
      .setDescription("A simple, open-source, and free, fast,\nsecure and reliable discord bot.")
      .setFooter({
        text:
          subcommand === "all"
            ? "You can send `/help command` follow with command name to get more information about it."
            : "You can send `/help all` to list all commands",
        iconURL: client.user!.avatarURL()!,
      })
      .setThumbnail(client.user!.displayAvatarURL())
      .setURL("https://x.vvx.bar/nt/git");

    // If subcommand is all
    switch (subcommand) {
      // If subcommand is all
      case "all":
        // Loop through categories
        for (const category of categories) {
          // Get all commands in category
          const commands = client.commands.filter((c) => c.category === category);

          // Add category to embed
          embed.addFields([{ name: `${category}`, value: `${commands.map((c) => `\`${c.data.name}\``).join(" ")}` }]);
        }
        break;
      case "command": {
        // Get command
        const command = interaction.options.getString("command");
        // Get command
        const commandData = client.commands.find((c) => c.data.name === command);
        // If command is not found
        if (!commandData) {
          // Send error message
          await interaction.reply({ content: "Command not found." });
          // Return
          return;
        }
        // Add command to embed
        embed.addFields({
          name: `${commandData.data.name.toUpperCase()}`,
          value: `**Description:** ${commandData.data.description}\n**Category:** ${
            commandData.category
          }\n**Options:** ${commandData.data.options.map((o: CommandData) => `\`${o.name}\``).join(" ")}`,
        });
        break;
      }
      default:
    }

    // Reply with embed
    await interaction.reply({
      embeds: [embed],
    });
  },
};
