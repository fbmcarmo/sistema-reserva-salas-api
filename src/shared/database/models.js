const User = require("../../modules/users/models/User");
const Room = require("../../modules/rooms/models/Room");
const Reservation = require("../../modules/reservations/models/Reservation");

User.initModel();
Room.initModel();
Reservation.initModel();

User.hasMany(Reservation, {
    foreignKey: "userId",
    as: "reservations",
});

Reservation.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

Room.hasMany(Reservation, {
    foreignKey: "roomId",
    as: "reservations",
});

Reservation.belongsTo(Room, {
    foreignKey: "roomId",
    as: "room",
});

module.exports = {
    User,
    Room,
    Reservation,
};