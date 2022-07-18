import { ChatInputCommandInteraction } from "discord.js";
import { checkUserExists } from "./checkUserExists.js";
import { getUserData } from "./getUserData.js";

export const getCoin = async (
  interaction: ChatInputCommandInteraction,
  userId: string,
  guildId: string,
): Promise<bigint | number> => {
  // Make sure the user exists
  await checkUserExists(interaction, userId, guildId);
  // Get the user coins from the database
  const userData = await getUserData(interaction, userId, guildId);
  // Return the coins
  return userData!.coin;
};
