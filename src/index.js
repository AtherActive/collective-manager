import Framework from 'strike-discord-salt-edits-temp';
import { sequelize } from './database.js';
import { CommandEvent } from 'strike-discord-salt-edits-temp/dist/command.js';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.TOKEN);

const framework = new Framework({
    token: process.env.TOKEN,
    defaultPrefix: '!',	
    ownerID: 189317034360832001,
    databaseOpts: {
        databaseName: "collective",
        url: "mongodb://10.0.100.2:27017/collective",
    },
    loggerOpts: {
        logToFile: true
    },
    dmPrefixOnPing: true,
    commandsPath: `${process.cwd()}/src/commands/`,
});

    // framework.loadBotCommands(`${process.cwd()}/../node_modules/strike-discord-salt-edits-temp/dist/defaultCommands/`);
    // framework.loadBotCommands(`${process.cwd()}/node_modules/strike-discord-framework/dist/defaultCommands/`);

await framework.init();
