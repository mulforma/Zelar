// Import ms
import ms from 'ms';
// Import CommandInteraction
import { CommandInteraction } from "discord.js";
// Import Knex
import { Knex } from "knex";
// Import TimeoutCommandData
import { TimeoutCommandData } from "../types/data/UserData";

export const checkTimeout = (interaction: CommandInteraction, db: Knex, cmdName: String, timeoutMs: number, userData: any): boolean => {
  // Get index
  const index = userData.timeout.commands.findIndex((i: TimeoutCommandData) => i.command === cmdName);

  // Check if index is valid
  if (index !== -1) {
    // Set timeout
    const timeout = userData.timeout.commands.find((i: TimeoutCommandData) => i.command === cmdName);
    // Check if timeout reaches the end
    if (Number(timeout.time + timeoutMs) - Date.now() <= 0) {
      // Update timeout
      userData.timeout.commands[index].time = Date.now();
    } else {
      // Send error message
      interaction.reply(
        `<@${interaction.user.id}> You can use this command again in ${ms(
          Number(timeout.time) + timeoutMs - Date.now(),
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
  db("user")
    .update({
      timeout: userData.timeout,
    })
    .where({
      userId: interaction.user.id,
      serverId: interaction.guild?.id,
    })
    .then();

  return false;
};
