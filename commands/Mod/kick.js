// Import SlashCommandBuilder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Import Permissions, MessageActionRow, MessageButton
const { Permissions, MessageActionRow, MessageButton } = require('discord.js');

// Export command
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
    // Set command name
        .setName('kick')
    // Set command description
        .setDescription('Kick a user')
    // Add command options
        .addUserOption((option) =>
            option
            // Set option name
                .setName('target')
            // Set option description
                .setDescription('Select a user to kick')
            // Set if option is required
                .setRequired(true)
        )
    // Add string option
        .addStringOption((option) =>
            option
            // Set option name
                .setName('reason')
            // Set option description
                .setDescription('Reason for kick')
            // Set if option is required
                .setRequired(false)
        ),
    // Set command category
    category: 'Mod',
    // Excute function
    /** 
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async execute(client, interaction) {
    // Get options value (target)
        const user = await
        /** @type {import('discord.js').GuildMember} */ (interaction.options.getMember('target'));
        // Interaction member
        const member = /** @type {import('discord.js').GuildMember} */ (interaction.member);
        // Check if user who called command has permissions 'KICK_MEMBERS'
        // More about Premission.FLAGS, see (https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS)
        if (!member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            // Reply user
            return await interaction.reply({
                // Set message content
                content:
          'You can\'t kick member because you have no permissions to kick.',
                // Set if only user who called command can see it
                ephemeral: true
            });
        }

        // If target user has higher roles than called user
        if (!user.kickable) {
            // Set message content
            return await interaction.reply({
                // Set message content
                content: 'You can\'t kick member with higher role than you.',
                // Set if only user who called command can see it
                ephemeral: true
            });
        }

        // Check if user want to kick yourself
        if (user.id === interaction.user.id) {
            // Set message content
            return await interaction.reply({
                // Set message content
                content: 'You can\'t kick yourself!',
                // Set if only user who called command can see it
                ephemeral: true
            });
        }

        // Add message components
        const confirm = new MessageActionRow().addComponents(
            // Add button
            new MessageButton()
            // Set button id
                .setCustomId('Confirm')
            // Set button message
                .setLabel('Confirm')
            // Set button style, see more (https://discord.js.org/#/docs/main/stable/typedef/MessageButtonStyle)
                .setStyle('DANGER')
        );

        // Get reason string
        const reason = await interaction.options.getString('reason');

        // Wait user to confirm
        await interaction.reply({
            content: `Are you sure you want to kick <@${user.id}>?`,
            components: [confirm],
            ephemeral: true
        });

        // Filter actions
        const filter = (i) =>
            // Button id must equal to 'Confirm' and user who click button is user who called command
            i.customId === 'Confirm' && i.user.id === interaction.user.id;

        // Start message collector
        const collector = interaction.channel.createMessageComponentCollector({
            // Add filter
            filter,
            // Set collector timeout (15 seconds)
            time: 15000
        });

        // On collector start
        collector.on('collect', async (
            /** @type {import('discord.js').MessageComponentInteraction}*/ i
        ) => {
            // If button id equal to 'Confirm'
            if (i.customId === 'Confirm') {
                // Kick user
                await user.kick(
                    // Check if there is reason text, if not, reason equal to 'Unspecified'
                    !reason ? 'Unspecified' : reason
                );
        
                // Update message
                await i.update({
                    // Set message content
                    content: `Successfully kick <@${user.id}>`,
                    // Clear message button
                    components: []
                });
            }
        });
    }
};