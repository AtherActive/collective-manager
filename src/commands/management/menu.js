import { Command, SlashCommand, SlashCommandEvent } from "strike-discord-salt-edits-temp/dist/command.js";
import Array from "../../models/Array.model.js";
import Discord from "discord.js";
import { subroutineRoleId, categoryId } from "../../config.js";
import { awaitMessage, confirmAction, embedBuilder, error, menuBuilder } from "../../utils.js";
import Config from "../../models/Config.model.js";

export default class Menu extends SlashCommand {
    name = 'menu';
    help = {
        msg: 'Edit your array.',
    }
    slashCommand = true;
    slashOptions = []

    async run(event) {
        let {framework, interaction} = event;
        let array = await Array.findOne({channelID: interaction.channel.id});

        // Check if we even are in an array channel
        if(!array) {
            await error('This channel is not an array', interaction);
            return;
        }

        // Check if the user has permissions for this array
        if(!array.ownerId == interaction.member.id) {
            let emb = embedBuilder('You do not have permission to do this', 'error');
            await interaction.reply({embeds:[emb], ephemeral: true});
            return;
        }

        // Build the menu
        const emb = {
            title: 'Array Menu',
            description: 'Please select an option',
            color: 'RED',
        }
        let menu = await menuBuilder(
            [
                new Discord.MessageButton(({
                    label: 'Create Announcement',
                    style: 'PRIMARY',
                    customId: 'announcement',
                })),
                new Discord.MessageButton(({
                    label: 'Send Ping',
                    style: 'PRIMARY',
                    customId: 'ping',
                })),
                new Discord.MessageButton(({
                    label: "Rename",
                    style: 'SECONDARY',
                    customId: 'rename',
                })),
                new Discord.MessageButton(({
                    label: "Toggle public",
                    style: 'SECONDARY',
                    customId: 'public',
                })),
                new Discord.MessageButton(({
                    label: "Delete Array",
                    style: 'DANGER',
                    customId: 'delete',
                })),

            ], emb, interaction,true)

        // Based on the response, execute a function.
        switch(await menu) {
            case 'announcement':
                await this.announcement(event);
                break;
            case 'delete':
                await this.delete(event);
                break;
            case 'rename':
                await this.rename(event);
                break;
            case 'public':
                await this.public(event);
                break;
            case 'ping': 
                await this.ping(event);
                break;
            default: 
                let reply = await interaction.fetchReply();
                await reply.delete();
        }
    }

    // Rename the array
    async rename(event) {
        let {framework, interaction} = event;
        let channel = interaction.channel;
        let array = await Array.findOne({where: {channelId: channel.id}});
        
        await interaction.editReply({embeds:[embedBuilder('Enter a name for this Array','input')], components:[],  ephemeral: true});
        let newName = await awaitMessage(interaction);
        if(!newName || newName.content.length > 32) {
            let emb = embedBuilder('No name provided or name too long.', 'error');
            await interaction.editReply({embeds:[emb], components:[], ephemeral: true});
            return;
        }

        await array.update({name: newName.content});
        await channel.setName(newName.content);
        
        let role = await interaction.guild.roles.fetch(array.roleId);
        await role.setName(newName.content);

        let emb = embedBuilder('Array renamed', 'success');
        await interaction.editReply({embeds:[emb], components:[], ephemeral: true});
        await newName.delete();
    }
    
    // Delete the attay
    async delete(event) {
        let {framework, interaction} = event;
        let channel = interaction.channel;
        let array = await Array.findOne({
            where: {
                channelId: channel.id,
            }
        });
        if(!array) {
            let emb = embedBuilder('This channel is not an array', 'error');
            await interaction.editReply({embeds:[emb], ephemeral: true});
            return;
        }

        // Send a confirmation message
        if(await confirmAction(`Are you sure you want to delete ${array.name}?`, interaction)) {
            let role = await interaction.guild.roles.fetch(array.roleId);
            await role.delete();
            await array.destroy();
            await channel.delete();
        } else {
            let emb = embedBuilder('Cancelled', 'error');
            await interaction.editReply({embeds:[emb],components:[], ephemeral: true});
        }
    }

    // Create a new announcement
    // Users can supply a message before it sends the announcement in the correct channel with a ping.
    async announcement(event) {
        let { framework, interaction } = event;

        let array = await Array.findOne({where:{channelId: interaction.channel.id}});

        let emb = embedBuilder('Please enter a message', 'input');
        await interaction.editReply({ embeds:[emb], components:[], ephemeral: true});
        let announcementContent = await awaitMessage(interaction);
        if(!await announcementContent) return;

        let announcementChannel = await Config.get('announcementChannel');
        let channel = await framework.client.channels.fetch(await announcementChannel);
        if(!channel) {
            let emb = embedBuilder('Announcement channel not found', 'error');
            await interaction.editReply({embeds:[emb], components:[], ephemeral: true});
            return;
        }

        await channel.send({content: `<@&${array.roleId}>\n` + await announcementContent.content});

        emb = embedBuilder('Announcement sent', 'success');
        await interaction.editReply({embeds:[emb], components:[], ephemeral: true});
        await announcementContent.delete();
    }

    // Toggle wether or not it should be public
    async public(event) {
        let {interaction} = event;
        let channel = interaction.channel;

        let array = await Array.findOne({where:{channelId: channel.id}});
        await array.update({isPublic: !array.isPublic});
        
        await channel.permissionOverwrites.edit(await interaction.guild.roles.everyone, {
            VIEW_CHANNEL: await array.isPublic,
        })

        let emb = embedBuilder(`Array is now ${await array.isPublic ? 'public' : 'private'}`, 'success')
        await interaction.editReply({ embeds:[emb], components:[], ephemeral: true});
    }

    // Send a ping in the Array channel.
    async ping(event) {
        let {interaction} = event;
        let channel = interaction.channel;
        let array = await Array.findOne({where:{channelId: channel.id}});
        await interaction.channel.send({content: `<@&${array.roleId}>`});
    }
}
