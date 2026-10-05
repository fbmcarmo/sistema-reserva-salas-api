const { Model, DataTypes } = require("sequelize");

const database = require("../../../shared/database/connection");

class Reservation extends Model {
    static initModel() {
        const sequelize = database.getConnection();

        Reservation.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
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
                    type: DataTypes.ENUM(
                        "CONFIRMADA",
                        "CANCELADA"
                    ),
                    allowNull: false,
                    defaultValue: "CONFIRMADA",
                },
            },
            {
                sequelize,
                modelName: "Reservation",
                tableName: "reservations",
                timestamps: true,
            }
        );

        return Reservation;
    }
}

module.exports = Reservation;