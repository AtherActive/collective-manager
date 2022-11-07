import { Command, SlashCommand, SlashCommandEvent } from "strike-discord-salt-edits-temp/dist/command.js";
import Array from "../../models/Array.model.js";
import { subroutineRoleId } from "../../config.js";

export default class Join extends SlashCommand {
    name='join';
    help = {
        msg: 'Join an array',
    }
    slashCommand = true;
    slashOptions = [
        {
            name: 'array',
            description: 'The array to join',
            type: 'CHANNEL',
            required: true,
        }
    ]

    async run(event) {
        let array;
        try {
            // Get the Array from the database. If it is not found, return an error.
            array = await this.getArray(event.interaction.options.getChannel('array'));
            if(!array) return 'Array not found';
        } catch(e) {
            await event.interaction.reply({content: `Error: ${e}`, ephemeral: true});
        }

        // If user is already in this array, return an error.
        if(event.interaction.member.roles.cache.has(array.roleId)) {
            await event.interaction.reply({content: 'You are already in this array!', ephemeral: true});
        }

        // if user is not a subroutine / if the array is not public, return an error.
        if(!event.interaction.member.roles.cache.has(subroutineRoleId) && !array.isPublic) {
            await event.interaction.reply({content: 'You do not have permission to join this array', ephemeral: true});
            return;
        }

        // Add the user to the array.
        await event.interaction.member.roles.add(array.roleId);
        await event.interaction.reply({content: `You have joined '${array.name}'`, ephemeral: true});
    }

    /**
     * Search for the array in the database.
     * @param {string} channel 
     * @returns Array if found, null if not found.
     */
    async getArray(channel) {
        return await Array.findOne({
            where: {
                channelId: channel.id,
            }
        })
    }
}