export async function confirmAction(prompt,interaction) {
    // Send a confirmation message
    let obj;
    if(typeof promt === 'string') {
        obj = {
            content: prompt,
            fetchReply: true,
        }
    } else if(typeof prompt === 'object') {
        obj = {
            embeds: [prompt],
            fetchReply: true,

        } 
    }
    let confirmation;
    if(typeof prompt === 'object') {
        confirmation = await interaction.reply({embeds: [prompt], fetchReply: true});
    } else {
        confirmation = await interaction.reply({content: prompt, fetchReply: true});
    }
    
    await confirmation.react('✅');
    await confirmation.react('❌');

    // Wait for a reaction
    let filter = (reaction, user) => {
        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === interaction.member.id;
    };
    let collected = await confirmation.awaitReactions({filter, max: 1, time: 60000, errors: ['time']})
    return collected.first().emoji.name === '✅';
}

export async function error(message, interaction) {
    let emb = {
        title: 'Error',
        description: message,
        color: 'RED',
    }
    await interaction.reply({embeds:[emb], ephemeral: true});
}