// Database init with Sequelize
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();


// Dotenv broke so just using a config file for now
const sequelize = new Sequelize('collective', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: '10.0.100.2',
    dialect: 'mysql',
});


setTimeout(async () => {

    const Array = await import('./models/Array.model.js');
    const Config = await import('./models/Config.model.js');

    await sequelize.sync({alter: true, logging: false});
},1000)

export {sequelize}