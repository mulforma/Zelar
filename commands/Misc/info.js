// Import SlashCommandBuilder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Import MessageEmbed
const { MessageEmbed } = require('discord.js');
// Import ms
const ms = require('ms');

// Export commands
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
    // Set command name
        .setName('info')
    // Set command description
        .setDescription('Give you information')
    // Add subcommand
        .addSubcommand((subcommand) =>
            subcommand
            // Set subcommand name
                .setName('member')
            // Set subcommand description
                .setDescription('Give guild member\'s information')
            // Add user options
                .addUserOption((option) =>
                    option
                    // Set option name
                        .setName('target')
                    // Set option description
                        .setDescription('Select a member')
                    // Set if command is required
                        .setRequired(true)
                )
        )
    // Add subcommand
        .addSubcommand((subcommand) =>
            subcommand
            // Set subcommand name
                .setName('server')
            // Set subcommand description
                .setDescription('Give server\'s information')
        ),
    // Set command category
    category: 'Misc',
    // Execute command function
    /** 
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async execute(client, interaction) {
    // Function getUserBannerUrl
        async function getUserBannerUrl(userId) {
            // Get user from userId
            /** @type {import('discord.js').User} */
            // @ts-ignore
            const user = await client.api.users(userId).get();
            // Return user banner
            return user.banner
            // Check if there is banner, if not, return default image
                ? `https://cdn.discordapp.com/banners/${userId}/${user.banner}?size=512`
                : 'https://i.redd.it/pyeuy7iyfw961.png';
        }

        // If user call subcommand 'member'
        if (interaction.options.getSubcommand() === 'member') {
            // Get GuildMember from target user
            const member =
                /** @type {import('discord.js').GuildMember} */
                (interaction.options.getMember('target'));
            // Create new embed
            const embed = new MessageEmbed()
            // Set embed title
                .setTitle(`🙍‍♂️ Member ${member.user.username}`)
            // Set embed color
                .setColor('RANDOM')
            // Add embed fields
            // More about GuildMember, see (https://discord.js.org/#/docs/main/stable/class/GuildMember)
            // More about User, see (https://discord.js.org/#/docs/main/stable/class/User)
                .addField('💳 Username', member.user.username, true)
                .addField('✏ Nickname', member.nickname ? member.nickname : 'No nickname', true)
                .addField('🆔 UserID', member.user.id, true)
                .addField('#️⃣ Discriminator', member.user.discriminator, true)
                .addField('🕐 Joined Discord', ms(Date.now() - member.user.createdTimestamp, { long: true }) +' ago', true)
                .addField('👋 Joined Server', ms(Date.now() - member.joinedTimestamp, { long: true }) + ' ago', true)
            // Set thumbnail as target user avatar
                .setThumbnail(member.user.avatarURL({ dynamic: false }))
            // Set image as user banner
                .setImage(await getUserBannerUrl(member.user.id));
      
            // Reply message with embed
            await interaction.reply({ embeds: [embed] });

            // If user call subcommand 'server'
        } else if (interaction.options.getSubcommand() === 'server') {
            // Fetch this server data
            const server = await interaction.guild;
            // Create MessageEmbed
            const embed = new MessageEmbed()
            // Set embed title
                .setTitle(`🚀 Server ${server.name}`)
            // Set embed color
                .setColor('RANDOM')
            // Add embed fields
            // More abour Guild, see (https://discord.js.org/#/docs/main/stable/class/Guild)
                .addField('👋 Server name', server.name, true)
                .addField('📃 Server ID', server.id, true)
                .addField('🙍‍♂️ Server Owner', `<@${server.ownerId}>`, true)
                .addField('👪 All member', `${server.memberCount} members`, true)
                .addField('🚫 NSFW Level', server.nsfwLevel, true)
                .addField('👮‍♀️ Verification level', server.verificationLevel, true)
                .addField('✅ isVerified', server.verified.toString(), true)
                .addField('🚨 mfaLevel', server.mfaLevel, true)
            // Set thumbnail as server icon
                .setThumbnail(server.iconURL());
            // Reply with embed
            await interaction.reply({ embeds: [embed] });
        }
    }
};
