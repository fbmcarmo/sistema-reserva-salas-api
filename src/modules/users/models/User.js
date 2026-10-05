const { DataTypes, Model } = require("sequelize");

const database = require("../../../shared/database/connection");

class User extends Model {
    static initModel() {
        const sequelize = database.getConnection();

        User.init(
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

                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },

                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },

                role: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: "USER",
                },
            },
            {
                sequelize,
                modelName: "User",
                tableName: "users",
                timestamps: true,
            }
        );

        return User;
    }
}

module.exports = User;