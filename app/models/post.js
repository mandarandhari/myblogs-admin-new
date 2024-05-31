const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

module.exports = sequelize.define('Posts', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    imagePath: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});