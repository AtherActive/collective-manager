import { Command, SlashCommand, SlashCommandEvent } from "strike-discord-salt-edits-temp/dist/command.js";
import Array from "../../models/Array.model.js";
import { error } from "../../utils.js";
import Config from "../../models/Config.model.js";

export default class SetRole extends SlashCommand {
    name = 'setrole';
    help = {
        msg: '[ADMIN] Set the member role for the manager.',
    }
    slashCommand = true;
    slashOptions = [
        {
            name: 'role',
            description: 'The role to use.',
            type: 'ROLE',
            required: true,
        }
    ]

    async run(event) {
        let {framework, interaction} = event;

        // Check if the user has in any way admin permissions
        if(!interaction.member.permissions.has('ADMINISTRATOR') || !framework.ownerID == interaction.member.id) {
            await error('You do not have permission to run this command.')
            return;
        }

        Config.set('memberRole', interaction.options.getRole('role').id);
        await interaction.reply({content: `Member role set to ${interaction.options.getRole('role').id}`, ephemeral: true});
    }
} 