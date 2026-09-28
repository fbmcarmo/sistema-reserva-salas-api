const { DataTypes, Model } = require("sequelize");
const database = require("../../../shared/database/connection");

class User extends Model {
    static initModel() {
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
            },
            {
                sequelize: database.getConnection(),
                modelName: "User",
                tableName: "users",
            }
        );

        return User;
    }
}

module.exports = User;