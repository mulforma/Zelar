// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import ms
const ms = require("ms");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("fishing")
    // Set command description
    .setDescription("Go fishing!"),
  // Set command category
  category: "Game",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    // Get user inventory and timeout
    client.db
      .select("inventory", "timeout")
      .from("user")
      .where("userId", interaction.user.id)
      .then(async (res) => {
        if (res[0].timeout.commands.map((i) => i.time) - Date.now() > 0) {
          interaction.send(
            `You can't use this command for another ${ms(res[0].timeout.commands.map((i) => i.time) - Date.now())}`,
          );
          return;
        }
        // Check if user has fishing rod
        if (res[0].inventory.items.map((i) => i.name).includes("Fishing Rod")) {
          // 50% chance of catching a fish with a fishing rod
          if (Math.random() < 0.5) {
            // Get random fish from table "globalItems"
            const fish = client.db
              .select("*")
              .from("globalItems")
              .where("itemType", "Collectable.Fish")
              .orderByRaw("RANDOM()")
              .limit(1)
              .then((res) => res[0]);
            // Add fish to inventory
            client.db
              .update("inventory", JSON.stringify(JSON.parse(res[0].inventory).items.concat(fish)))
              .where("userId", interaction.user.id)
              .then(() => {
                // Send message
                interaction.reply(`You caught a ${fish.itemName}!`);
                // Add command timeout to 5 minutes
                const timeoutTime = new Date().getTime();
                // Add time to table "timeout"
                client.db
                  .insert({
                    command: "fishing",
                    time: timeoutTime,
                  })
                  .where("userId", interaction.user.id)
                  .andWhere("serverId", interaction.guild.id);
              });
          } else {
            // Send message
            await interaction.reply("😢 Sadly, You didn't catch anything.");
          }
          // Add fish to inventory
          client.db
            .insert({
              userId: interaction.user.id,
              itemId: "fish",
            })
            .into("inventory")
            .then(() => {
              // Send message
              interaction.send("You put the fish in your inventory!");
            });
        } else {
          // 15% chance of catching a fish without a fishing rod
          if (Math.random() < 0.15) {
            // Get random fish from table "globalItems"
            const fish = client.db
              .select("*")
              .from("globalItems")
              .where("itemType", "Collectable.Fish")
              .orderByRaw("RANDOM()")
              .limit(1)
              .then((res) => res[0]);
            // Add fish to inventory
            client.db
              .update(
                "inventory",
                JSON.stringify(
                  JSON.parse(res[0].inventory).items.concat({
                    amount: 1,
                    id: fish.itemId,
                    name: fish.itemName,
                    rarity: fish.rarity,
                    usable: false,
                    type: fish.itemType,
                    emoji: fish.itemEmoji,
                    description: fish.description,
                  }),
                ),
              )
              .where("userId", interaction.user.id)
              .andWhere("serverId", interaction.guild.id)
              .then(() => {
                // Send message
                interaction.reply(`You caught a ${fish.itemName}!`);
                // Add command timeout to 5 minutes
                const timeoutTime = new Date().getTime();
                // Set command timeout
                const cmdTimeout = {
                  command: "fishing",
                  time: timeoutTime,
                };
                // Add time to column "timeout" in table "user"
                client.db
                  .update("timeout", JSON.stringify(JSON.parse(res[0].timeout).commands.concat(cmdTimeout)))
                  .where("userId", interaction.user.id)
                  .andWhere("serverId", interaction.guild.id);
              });
          } else {
            // Send message
            interaction.reply(
              "😢 Sadly, You didn't catch anything.\n(You need a fishing rod to increase your chances of catching a fish)",
            );
          }
        }
      });
  },
};
