import { sequelize } from "../database.js"
import Sequelize from "sequelize"

const Array = sequelize.define("Array", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ownerId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    roleId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    channelId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
})

export default Array;