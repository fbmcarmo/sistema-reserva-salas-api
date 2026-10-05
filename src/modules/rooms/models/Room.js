const { Model, DataTypes } = require("sequelize");

const database = require("../../../shared/database/connection");

class Room extends Model {
    static initModel() {
        const sequelize = database.getConnection();

        Room.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },

                nome: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },

                descricao: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },

                capacidade: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                localizacao: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },

                recursos: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },

                status: {
                    type: DataTypes.ENUM("ATIVA", "INATIVA"),
                    allowNull: false,
                    defaultValue: "ATIVA",
                },
            },
            {
                sequelize,
                modelName: "Room",
                tableName: "rooms",
                timestamps: true,
            }
        );

        return Room;
    }
}

module.exports = Room;