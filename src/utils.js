import Discord from 'discord.js';

export async function confirmAction(prompt,interaction) {
    // Send a confirmation message
    let emb;
    if(typeof prompt === 'string') {
        emb = embedBuilder(prompt, 'input');
    } else if(typeof prompt === 'object') {
        emb = prompt
    }
    let menu = await menuBuilder([
        new Discord.MessageButton(({
            label: 'Confirm',
            style: 'SUCCESS',
            customId: 'confirm',
        })),
        new Discord.MessageButton(({
            label: 'Cancel',
            style: 'DANGER',
            customId: 'cancel',
        })),
    ],emb,interaction,true);

    return await menu == 'confirm';
}

export async function menuBuilder(buttons,embed,interaction,ephemeral=true) {
    let row = new Discord.MessageActionRow();
    row.addComponents(buttons);

    let confirm;
    try {
        confirm = await interaction.reply({embeds: [embed], components: [row], ephemeral: ephemeral, fetchReply: true});
    } catch {
        await interaction.editReply({embeds: [embed], components: [row], ephemeral: ephemeral, fetchReply: true});
        confirm = await interaction.fetchReply();
    }
    let filter = (interaction) => {
        return interaction.user.id === interaction.member.id;
    }
    try {
        let collected = await confirm.awaitMessageComponent({filter, time: 60000, errors: ['time']});
        return collected.customId;
    } catch {
        return false;
    }
}

export async function error(message, interaction) {
    let emb = {
        title: 'Error',
        description: message,
        color: 'RED',
    }
    await interaction.reply({embeds:[emb], ephemeral: true});
}

export async function awaitMessage(interaction) {
    let filter = (message) => {
        return message.author.id === interaction.member.id;
    }
    try {
        let collected = await interaction.channel.awaitMessages({filter, max: 1, time: 60000, errors: ['time']}).catch();
        return collected.first();
    } catch (e){
        console.log(e)
        return null;
    }

}

export function embedBuilder(description,type) {
    let emb = new Discord.MessageEmbed({
        title: 'Success',
        description: description,
        color: 'GREEN',
    }).setFooter({
        text: 'We are one.',
        iconURL: 'https://cdn.discordapp.com/attachments/1039278012329369740/1039278039105802270/744520554132013127.png'
    })
    if(type === 'error') {
        emb.title = 'Error';
        emb.color = 'RED';
        return emb;
    } else if(type === 'success') {
        emb.title = 'Success';
        emb.color = 'GREEN';
        return emb;
    } else if(type === 'input') {
        emb.title = 'Input';
        emb.color = 'BLUE';
        emb.footer.text = 'Expires in one minute.'
        return emb;
    }
}