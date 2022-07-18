import { SlashCommandBuilder } from "discord.js";
import { Client, ChatInputCommandInteraction } from "discord.js";

export interface CommandData {
  data: SlashCommandBuilder;
  category: "Economics" | "Fun" | "Game" | "Image" | "Misc" | "Mod" | "Music" | "Nsfw" | "Profile" | "Search" | "Utils";
  execute: (client: Client, interaction: ChatInputCommandInteraction) => Promise<any>;
  name: string;
  description: string;
}
