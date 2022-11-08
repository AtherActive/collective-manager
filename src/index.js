import Framework from 'strike-discord-salt-edits-temp';
import dotenv from 'dotenv';
import Config from './models/Config.model.js';
dotenv.config();

const framework = new Framework({
    token: process.env.TOKEN,
    defaultPrefix: '!',	
    ownerID: '189317034360832001',
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

await framework.init();
