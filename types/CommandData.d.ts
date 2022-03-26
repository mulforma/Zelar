import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";

export interface CommandData {
  data: SlashCommandBuilder;
  category: "Economics" | "Fun" | "Game" | "Image" | "Misc" | "Mod" | "Music" | "Nsfw" | "Profile" | "Search" | "Utils";
  execute: (client: Client, interaction: CommandInteraction) => Promise<void>;
  name: string;
  description: string;
}
