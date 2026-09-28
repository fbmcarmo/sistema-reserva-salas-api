const { DataTypes, Model } = require("sequelize");
const database = require("../../../shared/database/connection");

class Reservation extends Model {
    static initModel() {
        Reservation.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },

                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                roomId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                startDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },

                endDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },

                status: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: "ACTIVE",
                },
            },
            {
                sequelize: database.getConnection(),
                modelName: "Reservation",
                tableName: "reservations",
            }
        );

        return Reservation;
    }
}

module.exports = Reservation;