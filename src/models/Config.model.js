import { sequelize } from "../database.js"
import Sequelize from "sequelize"

const Config = sequelize.define("Config", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    key: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    value: {
        type: Sequelize.STRING,
        allowNull: false,
    },
})

Config.get = async function(key) {
    if(Config.cache[key]) return Config.cache[key];
    
    let config = await Config.findOne({where: {key: key}});
    if(!config) {
        return null;
    }
    return config.value;
}

Config.set = async function(key, value) {
    Config.cache[key] = value;
    let config = await Config.findOne({where: {key: key}});
    if(!config) {
        await Config.create({key: key, value: value});
    } else {
        await config.update({value: value});
    }
}

Config.cache = {}

export default Config;