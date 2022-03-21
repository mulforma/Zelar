"use strict";
// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import canvas
const Canvas = require("canvas");
// Export command
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
        // Set command name
        .setName("beautiful")
        // Set command description
        .setDescription("How beautiful you are?")
        // Add user option
        .addUserOption((option) => option
        // Set option name
        .setName("target")
        // Set option description
        .setDescription("Target user")
        // Set option required
        .setRequired(false)),
    // Set command category
    category: "Image",
    // Execute function
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client, interaction) {
        // Apply text
        const applyText = (canvas, text) => {
            const context = canvas.getContext("2d");
            // Declare a base size of the font
            let fontSize = 70;
            do {
                // Assign the font to the context and decrement it, so it can be measured again
                context.font = `${(fontSize -= 10)}px sans-serif`;
                // Compare pixel width of the text to the canvas minus the approximate avatar size
            } while (context.measureText(text).width > canvas.width - 300);
            // Return the result to use in the actual canvas
            return context.font;
        };
        // Get user
        const user = interaction.options.getUser("target") || interaction.user;
        // Get user avatar
        const avatar = user.displayAvatarURL({ format: "png", size: 1024 });
        // Load card image
        const card = await Canvas.loadImage("./assets/beautiful.png");
        // Load avatar
        const avatarImg = await Canvas.loadImage(avatar);
        // Create canvas
        const canvas = Canvas.createCanvas(700, 250);
        // Get canvas context
        const ctx = canvas.getContext("2d");
        // Draw image background
        ctx.drawImage(card, 0, 0, canvas.width, canvas.height);
        // Set shadow
        ctx.shadowColor = "black";
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 10;
        ctx.shadowBlur = 25;
        // Apply header text
        ctx.font = applyText(canvas, "Beautiful Rate");
        // Set fill color
        ctx.fillStyle = "#ffffff";
        // Draw text
        ctx.fillText("Beautiful Rate", canvas.width / 2.5, canvas.height / 2.3);
        // Apply random number text
        ctx.font = applyText(canvas, Math.floor(Math.random() * 100) + 1);
        // Set fill color
        ctx.fillStyle = "#ffffff";
        // Draw text
        ctx.fillText(`${Math.floor(Math.random() * 100) + 1}%`, canvas.width / 2.5, canvas.height / 1.3);
        // Begin path
        ctx.beginPath();
        // Draw arc
        ctx.arc(130, 125, 100, 0, Math.PI * 2, true);
        // Close path
        ctx.closePath();
        // Clip
        ctx.clip();
        // Add avatar
        ctx.drawImage(avatarImg, 30, 25, 220, 220);
        // Buffer canvas
        const buffer = await canvas.toBuffer();
        // Send image
        await interaction.reply({
            files: [
                {
                    attachment: buffer,
                },
            ],
        });
    },
};
