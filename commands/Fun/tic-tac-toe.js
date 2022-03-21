// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import MessageActionRow, MessageButton, and MessageEmbed
const { Client, CommandInteraction, MessageButton, MessageEmbed } = require("discord.js");

// Tic-Tac-Toe class
class TicTacToe {
  constructor() {
    this.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }
  tick(side, x, y) {
    // Check if the board is already ticked
    if (this.board[x][y] !== 0) return false;
    this.board[x][y] = side;
    return true;
  }
  checkIfWin() {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2]) {
        return this.board[i][0];
      }
    }
    // Check columns
    for (let i = 0; i < 3; i++) {
      if (this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i]) {
        return this.board[0][i];
      }
    }
    // Check left diagonal
    if (this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) {
      return this.board[0][0];
    }
    // Check right diagonal
    if (this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) {
      return this.board[0][2];
    }

    // If all space are filled
    if (this.board.every((row) => row.every((cell) => cell !== 0))) {
      return -1;
    }
    // If player is not finished
    return 0;
  }
  reset() {
    this.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }
}

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("tic-tac-toe")
    // Set command description
    .setDescription("Play a game of tic-tac-toe with the another player.")
    // Add user option
    .addUserOption((option) =>
      option
        // Set option name
        .setName("user")
        // Set option description
        .setDescription("The user to play the game with.")
        // Set option required
        .setRequired(true),
    ),
  // Set command category
  category: "Fun",
  // Execute function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get user if exists
    const user = interaction.options.getUser("user");
    // Player rounds
    let player = 1;
    // Define board
    const board = [
      [
        new MessageButton().setCustomId("1,1").setStyle("PRIMARY").setLabel("1"),
        new MessageButton().setCustomId("1,2").setStyle("PRIMARY").setLabel("2"),
        new MessageButton().setCustomId("1,3").setStyle("PRIMARY").setLabel("3"),
      ],
      [
        new MessageButton().setCustomId("2,1").setStyle("PRIMARY").setLabel("4"),
        new MessageButton().setCustomId("2,2").setStyle("PRIMARY").setLabel("5"),
        new MessageButton().setCustomId("2,3").setStyle("PRIMARY").setLabel("6"),
      ],
      [
        new MessageButton().setCustomId("3,1").setStyle("PRIMARY").setLabel("7"),
        new MessageButton().setCustomId("3,2").setStyle("PRIMARY").setLabel("8"),
        new MessageButton().setCustomId("3,3").setStyle("PRIMARY").setLabel("9"),
      ],
    ];
    // Define game
    const game = new TicTacToe();
    // Set message embed
    const embed = new MessageEmbed()
      .setTitle("Tic-Tac-Toe")
      .setDescription(
        `Welcome to Tic-Tac-Toe!\n${user.username} is playing with you.\n\n${game.board
          .map((row) => row.map((cell) => (cell === 0 ? "❓" : cell === 1 ? "❌" : "⭕")).join(" | "))
          .join("\n")}
            `,
      )
      .setFooter({
        text: `Player ${player === 1 ? interaction.user.username : user.username} is playing`,
      });

    interaction.reply({
      embeds: [embed],
      components: [
        {
          type: 1,
          components: [...board[0]],
        },
        {
          type: 1,
          components: [...board[1]],
        },
        {
          type: 1,
          components: [...board[2]],
        },
      ],
    });
    // Filter for answer buttons
    const filter = (i) =>
      // Check if button match "digit,digit"
      /^\d+,\d+$/.test(i.customId) &&
      // Check if author is same as user
      (player === 2 ? i.user.id === user.id : i.user.id === interaction.user.id);
    // Start message collector
    const collector = interaction.channel.createMessageComponentCollector({
      // Add filter
      filter,
      // Set collector timeout (30 seconds)
      time: 30000,
    });
    // On collect
    collector.on("collect", async (/** @type {import('discord.js').MessageComponentInteraction}*/ i) => {
      // Defer update
      await i.deferUpdate();
      // Get button id
      const id = i.customId;
      // Get x and y
      const [x, y] = id.split(",");
      // Check cell is taken
      if (!game.tick(player, x - 1, y - 1)) {
        return interaction.editReply({
          content: "That cell is already taken!",
        });
      }
      // Set cell
      game.tick(player, x - 1, y - 1);
      // Set game player
      player = player === 2 ? 1 : 2;
      // Set message embed
      embed
        .setDescription(
          `${user.username} is playing with you.\n\n${game.board
            .map((row) => row.map((cell) => (cell === 0 ? "❓" : cell === 1 ? "❌" : "⭕")).join(" | "))
            .join("\n")}
            `,
        )
        .setFooter({
          text: `Player ${player === 1 ? interaction.user.username : user.username} is playing`,
        });
      // Check if game is over
      if (game.checkIfWin() > 0) {
        // Send congratulations message
        return interaction.editReply({
          content: `🎉 Congratulations ${
            game.checkIfWin() === 1 ? interaction.user.username : user.username
          }! You won!`,
          embeds: [embed],
          components: [],
        });
      } else if (game.checkIfWin() === -1) {
        // Send draw message
        return interaction.editReply({
          content: "😢 It's a draw!",
          embeds: [embed],
          components: [],
        });
      }
      // Edit message
      await interaction.editReply({
        embeds: [embed],
      });
    });
  },
};
