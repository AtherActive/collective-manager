import { Command, SlashCommand, SlashCommandEvent } from "strike-discord-salt-edits-temp/dist/command.js";
import Array from "../../models/Array.model.js";
import { subroutineRoleId, categoryId } from "../../config.js";

export default class create extends SlashCommand {
    name = 'create';
    help = {
        msg: 'Create an array',
    }
    slashCommand = true;
    slashOptions = [
        {
            name: 'name',
            description: 'Name for the array',
            type: 'STRING',
            required: true,
        },
        {
            name: 'description',
            description: 'A short description of the array',
            type: 'STRING',
            required: true,
        },
        {
            name: 'ispublic',
            description: 'Whether or not the array is public.',
            type: 'BOOLEAN',
            required: true,
        }
    ]

    async run(event) {
        let {framework, interaction} = event;

        // Check if the user has the member role
        if(!interaction.member.roles.cache.has(subroutineRoleId)) {
            await interaction.reply({content: 'You do not have permission to create an array', ephemeral: true});
            return;
        }

        // Create the required channels and roles
        let role = await interaction.guild.roles.create({
            name: interaction.options.getString('name'),
            reason: `Array created by ${interaction.user.tag}`,
        });
        let channel = await interaction.guild.channels.create(interaction.options.getString('name'), {
            type: 'GUILD_TEXT',
            parent: categoryId,
            topic: interaction.options.getString('description'),
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: interaction.options.getBoolean('ispublic') ? ['SEND_MESSAGES'] : ['VIEW_CHANNEL', 'SEND_MESSAGES']
                },
                {
                    id: role,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
            ],
            reason: `Array created by ${interaction.user.tag}`,
        });

        // Create the array in the database
        await Array.create({
            ownerId: interaction.user.id,
            roleId: role.id,
            channelId: channel.id,
            name: interaction.options.getString('name'),
            description: interaction.options.getString('description'),
            isPublic: interaction.options.getBoolean('ispublic') || false,
        });

        // Add the owner to the Array and send a message confirming the creation
        await interaction.member.roles.add(role);
        await interaction.reply({content: `Array created!`, ephemeral: true});
    }
}