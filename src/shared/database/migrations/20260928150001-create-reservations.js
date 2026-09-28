"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("reservations", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,

                references: {
                    model: "users",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },

            roomId: {
                type: Sequelize.INTEGER,
                allowNull: false,

                references: {
                    model: "rooms",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },

            startDate: {
                type: Sequelize.DATE,
                allowNull: false
            },

            endDate: {
                type: Sequelize.DATE,
                allowNull: false
            },

            status: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "ACTIVE"
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("reservations");
    }
};