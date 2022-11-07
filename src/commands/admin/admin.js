import { Command, SlashCommand, SlashCommandEvent } from "strike-discord-salt-edits-temp/dist/command.js";
import Array from "../../models/Array.model.js";
import { subroutineRoleId, categoryId } from "../../config.js";

export default class Admin extends SlashCommand {
    name = 'admin';
    help = {
        msg: '[ADMIN] Admin management menu',
    }
    slashCommand = true;
    slashOptions = [
    ]

    async run(event) {
        let {framework, interaction} = event;

        // Check if the user has in any way admin permissions
        if(!interaction.member.permissions.has('ADMINISTRATOR') || !framework.ownerID != interaction.member.id) {
            await interaction.reply({content: 'You do not have permission to use this command', ephemeral: true});
            return;
        }
    }
}