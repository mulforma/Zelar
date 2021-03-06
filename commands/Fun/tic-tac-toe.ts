import { SlashCommandBuilder, SlashCommandUserOption } from "discord.js";
import {
  Client,
  ChatInputCommandInteraction,
  ButtonBuilder,
  MessageComponentInteraction,
  EmbedBuilder,
} from "discord.js";
import { ButtonStyle } from "discord-api-types/v10";

// Tic-Tac-Toe class
class TicTacToe {
  board: number[][];

  constructor() {
    this.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }

  tick(side: number, x: number, y: number) {
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
}

export default {
  data: new SlashCommandBuilder()
    .setName("tic-tac-toe")
    .setDescription("Play a game of tic-tac-toe with the another player.")
    .addUserOption((option: SlashCommandUserOption) =>
      option.setName("user").setDescription("The user to play the game with.").setRequired(true),
    ),
  category: "Fun",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get user if exists
    const user = interaction.options.getUser("user");
    // Player rounds
    let player = 1;
    // Define board
    const board = [
      [
        new ButtonBuilder().setCustomId("1,1").setStyle(ButtonStyle.Primary).setLabel("1"),
        new ButtonBuilder().setCustomId("1,2").setStyle(ButtonStyle.Primary).setLabel("2"),
        new ButtonBuilder().setCustomId("1,3").setStyle(ButtonStyle.Primary).setLabel("3"),
      ],
      [
        new ButtonBuilder().setCustomId("2,1").setStyle(ButtonStyle.Primary).setLabel("4"),
        new ButtonBuilder().setCustomId("2,2").setStyle(ButtonStyle.Primary).setLabel("5"),
        new ButtonBuilder().setCustomId("2,3").setStyle(ButtonStyle.Primary).setLabel("6"),
      ],
      [
        new ButtonBuilder().setCustomId("3,1").setStyle(ButtonStyle.Primary).setLabel("7"),
        new ButtonBuilder().setCustomId("3,2").setStyle(ButtonStyle.Primary).setLabel("8"),
        new ButtonBuilder().setCustomId("3,3").setStyle(ButtonStyle.Primary).setLabel("9"),
      ],
    ];
    // Define game
    const game = new TicTacToe();
    // Set message embed
    const embed = new EmbedBuilder()
      .setTitle("Tic-Tac-Toe")
      .setDescription(
        `Welcome to Tic-Tac-Toe!\n${user!.username} is playing with you.\n\n${game.board
          .map((row) => row.map((cell) => (cell === 0 ? "???" : cell === 1 ? "???" : "???")).join(" | "))
          .join("\n")}
            `,
      )
      .setFooter({
        text: `Player ${player === 1 ? interaction.user.username : user!.username} is playing`,
      });

    await interaction.reply({
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
    const filter = (i: MessageComponentInteraction) =>
      // Check if button match "digit,digit"
      /^\d+,\d+$/.test(i.customId) &&
      // Check if author is same as user
      (player === 2 ? i.user.id === user!.id : i.user.id === interaction.user.id);
    // Start message collector
    const collector = interaction.channel!.createMessageComponentCollector({
      // Add filter
      filter,
      // Set collector timeout (30 seconds)
      time: 30000,
    });
    // On collect

    collector.on("collect", async (i: MessageComponentInteraction) => {
      // Defer update
      await i.deferUpdate();
      // Get button id
      const id = i.customId;
      // Get x and y
      const [x, y] = id.split(",");
      // Check cell is taken
      if (!game.tick(player, Number(x) - 1, Number(y) - 1)) {
        await interaction.editReply({
          content: "That cell is already taken!",
        });
      }
      // Set cell
      game.tick(player, Number(x) - 1, Number(y) - 1);
      // Set game player
      player = player === 2 ? 1 : 2;
      // Set message embed
      embed
        .setDescription(
          `${user!.username} is playing with you.\n\n${game.board
            .map((row) => row.map((cell) => (cell === 0 ? "???" : cell === 1 ? "???" : "???")).join(" | "))
            .join("\n")}
            `,
        )
        .setFooter({
          text: `Player ${player === 1 ? interaction.user.username : user!.username} is playing`,
        });
      // Check if game is over
      if (game.checkIfWin() > 0) {
        // Send congratulations message
        await interaction.editReply({
          content: `???? Congratulations ${
            game.checkIfWin() === 1 ? interaction.user.username : user!.username
          }! You won!`,
          embeds: [embed],
          components: [],
        });
      } else if (game.checkIfWin() === -1) {
        // Send draw message
        await interaction.editReply({
          content: "???? It's a draw!",
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
