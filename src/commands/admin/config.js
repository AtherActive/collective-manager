import { Command, SlashCommand, SlashCommandEvent } from "strike-discord-salt-edits-temp/dist/command.js";
import Array from "../../models/Array.model.js";
import { confirmAction, embedBuilder, error } from "../../utils.js";
import { config } from "dotenv";
import Config from "../../models/Config.model.js";

export default class ConfigComamnd extends SlashCommand {
    name = 'config';
    help = {
        msg: '[ADMIN] Set config properties.',
    }
    slashCommand = true;
    slashOptions = [
        {
            name: 'key',
            description: 'The key to set.',
            type: 'STRING',
            required: true,
        },
        {
            name: 'value',
            description: 'The value to set.',
            type: 'STRING',
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

        let key = interaction.options.getString('key');
        let value = interaction.options.getString('value');

        let current = await Config.get(key);
        Config.set(key, value);

        let emb = embedBuilder(`Updated config key '${key}' to '${value}'\nOld value: '${current}'`, 'success')
        await interaction.reply({embeds:[emb], ephemeral: true});
    }
} 