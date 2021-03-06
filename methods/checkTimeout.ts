import { ChatInputCommandInteraction } from "discord.js";
import { TimeoutCommandData } from "../types/UserData";
import { prisma } from "../prisma/connect.js";
import ms from "ms";

export const checkTimeout = async (
  interaction: ChatInputCommandInteraction,
  cmdName: string,
  timeoutMs: number,
  userData: any,
): Promise<boolean> => {
  // Get index
  const index = userData.timeout.commands.findIndex((i: TimeoutCommandData) => i.command === cmdName);

  // Check if index is valid
  if (index !== -1) {
    // Set timeout
    const timeout = userData.timeout.commands.find((i: TimeoutCommandData) => i.command === cmdName);
    // Check if timeout reaches the end
    if (Number((timeout?.time ?? 0) + timeoutMs) - Date.now() <= 0) {
      // Update timeout
      userData.timeout.commands[index].time = Date.now();
    } else {
      // Send error message
      await interaction.reply(
        `<@${interaction.user.id}> You can use this command again in ${ms(
          Number(timeout?.time) + timeoutMs - Date.now(),
        )}`,
      );
      return true;
    }
  }
  // Check if index is -1
  if (index === -1) {
    // Add timeout
    userData.timeout.commands.push({
      command: cmdName,
      time: Date.now(),
    });
  }

  // Save timeout
  await prisma.user.updateMany({
    where: {
      userId: interaction.user.id,
      serverId: interaction.guild?.id!,
    },
    data: {
      timeout: userData.timeout,
    },
  });

  return false;
};
