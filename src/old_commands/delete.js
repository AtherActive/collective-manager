import { Command, SlashCommand, SlashCommandEvent } from "strike-discord-salt-edits-temp/dist/command.js";
import Array from "../models/Array.model.js";
import { subroutineRoleId, categoryId } from "../config.js";
import { confirmAction } from "../utils.js";

export default class Delete extends SlashCommand {
    name = 'delete';
    help = {
        msg: 'Delete an array',
    }
    slashCommand = true;
    slashOptions = []

    async run(event) {
        let {framework, interaction} = event;
        let array;
        // Check if the array exists based on current channel
        try {
            array = await Array.findOne({
                where: {
                    channelId: interaction.channelId,
                }
            })
            if(!array) {
                await interaction.reply({content: 'This is not an array', ephemeral: true});
                return;
            }

        } catch(e) {
            await interaction.reply({content: `Error: ${e}`, ephemeral: true});
            return;
        }

        // Check if the user is the owner of the array
        if(array.ownerId !== interaction.member.id) {
            await interaction.reply({content: 'You are not the owner of this array', ephemeral: true});
            return;
        }
        let emb = {
            title: `Are you sure you want to delete '${array.name}'?`,
            description: 'This action cannot be undone.',
            color: 'RED',
        }
        let confirm = await confirmAction(emb,interaction)
        if(confirm) {
            // Delete the array role
            let role = await interaction.guild.roles.fetch(array.roleId);
            await role.delete();
            
            // Delete the array channel
            let channel = await interaction.guild.channels.fetch(array.channelId);
            await channel.delete();
            
            // Delete the array from the database
            await array.destroy();

        }

    }
}