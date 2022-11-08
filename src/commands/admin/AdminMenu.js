import { SlashCommand } from "strike-discord-salt-edits-temp/dist/command.js";
import Array from "../../models/Array.model.js";
import Discord from "discord.js";
import { menuBuilder } from "../../utils.js";
import Config from "../../models/Config.model.js";
import Configuration from "../../config.js";

export default class AdminMenu extends SlashCommand {
    name = 'adminmenu';
    help = {
        msg: '[ADMIN] Admin management menu',
    }
    slashCommand = true;
    slashOptions = []

    async run(event) {
        let {framework, interaction} = event;

        // Check if the user has in any way admin permissions
        if(!interaction.member.permissions.has('ADMINISTRATOR') || !framework.ownerID == interaction.member.id) {
            await interaction.reply({content: 'You do not have permission to use this command', ephemeral: true});
            return;
        }
        const emb = {
            title: 'Admin Menu',
            description: 'Please select an option',
            color: 'RED',
        }
        let menu = await menuBuilder(
            [
                new Discord.MessageButton(({
                    label: 'Hook',
                    style: 'SECONDARY',
                    customId: 'hook',
                })),
                new Discord.MessageButton(({
                    label: "Config Announcement Channel",
                    style: 'SECONDARY',
                    customId: 'announcement',
                })),
                new Discord.MessageButton(({
                    label: "Force Delete Array",
                    style: 'DANGER',
                    customId: 'delete',
                })),

            ], emb, interaction)

        switch(await menu) {
            case 'hook':
                await this.hook(event);
                break;
            case 'delete':
                await this.delete(event);
                break;
            case 'announcement':
                await this.announcement(event);
                break;
            default: 
                let reply = await interaction.fetchReply();
                await reply.react('❌');
        }
    }

    async hook(event) {
        let {framework, interaction} = event;
        let channel = interaction.channel;
        let role = await interaction.guild.roles.create({
            name: channel.name,
            reason: `Array created by ${interaction.user.tag}`
        })

        await channel.permissionOverwrites.create(role, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
        }),
        await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: false,
        })
        await channel.permissionOverwrites.create(interaction.guild.roles.fetch(Configuration.subroutineRoleId), {
            VIEW_CHANNEL: true,
        })

        await Array.create({
            name: channel.name,
            description: channel.topic || '',
            isPublic: false,
            channelId: channel.id,
            roleId: role.id,
            ownerId: interaction.user.id,
        })

        await interaction.editReply({content: 'Array hooked successfully', embeds:[], components:[], ephemeral: true});
    }
    

    async delete(event) {
        let {framework, interaction} = event;
        let channel = interaction.channel;
        let array = await Array.findOne({where: {channelId: channel.id}});
        if(!array) {
            await interaction.editReply({content: 'This channel is not an array', ephemeral: true});
            return;
        }

        let menu = await menuBuilder([
            new Discord.MessageButton(({
                label: 'Yes',
                style: 'DANGER',
                customId: 'yes',
            })),
            new Discord.MessageButton(({
                label: 'No',
                style: 'SECONDARY',
                customId: 'no',
            })),
        ],{
            title: 'Are you sure?',
            description: 'This will delete the array and all its data',
            color: 'RED',
        }, interaction,true);

        if(menu == 'yes') {
            let role = await interaction.guild.roles.fetch(array.roleId);
            await role.delete();
            await array.destroy();
            await channel.delete();
        }
    }

    async announcement(event) {
        let { framework, interaction } = event;
        await Config.set('announcementChannel', interaction.channel.id);
        await interaction.editReply({content: 'Announcement channel set successfully', embeds:[], components:[], ephemeral: true});
    }
}