const { DataTypes, Model } = require("sequelize");
const database = require("../../../shared/database/connection");

class Room extends Model {
    static initModel() {
        Room.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },

                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },

                capacity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize: database.getConnection(),
                modelName: "Room",
                tableName: "rooms",
            }
        );

        return Room;
    }
}

module.exports = Room;