import { Command, SlashCommand, SlashCommandEvent } from "strike-discord-salt-edits-temp/dist/command.js";
import Array from "../../models/Array.model.js";

export default class Join extends SlashCommand {
    name='leave';
    help = {
        msg: 'leave an array',
    }
    slashCommand = true;
    slashOptions = [
        {
            name: 'array',
            description: 'The array to leave',
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
            await event.interaction.editReply({content: `Error: ${e}`, ephemeral: true});
        }

        // If the user is NOT in the array, return an error.
        if(!event.interaction.member.roles.cache.has(array.roleId)) {
            await event.interaction.editReply({content: 'You are not in this array!', ephemeral: true});
        }

        // Remove the user to the array.
        await event.interaction.member.roles.remove(array.roleId);
        await event.interaction.editReply({content: `You have left '${array.name}'`, ephemeral: true});
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
