const { DataTypes } = require('sequelize');
const sequelize = require('../../../shared/database/connection');
const User = require('../../users/models/User');
const Room = require('../../rooms/models/Room');

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'rooms',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  data: {
    type: DataTypes.DATEONLY, // Formato AAAA-MM-DD
    allowNull: false,
  },
  hora_inicio: {
    type: DataTypes.STRING(5), // Formato "HH:mm" (ex: "09:00")
    allowNull: false,
  },
  hora_fim: {
    type: DataTypes.STRING(5), // Formato "HH:mm" (ex: "10:00")
    allowNull: false,
  },
  finalidade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('PENDENTE', 'CONFIRMADA', 'CANCELADA', 'CONCLUIDA'),
    defaultValue: 'CONFIRMADA',
    allowNull: false,
  },
}, {
  tableName: 'reservations',
  timestamps: true,
});

// Configuração dos relacionamentos (Associações 1:N e N:1)
User.hasMany(Reservation, { foreignKey: 'user_id', as: 'reservas' });
Reservation.belongsTo(User, { foreignKey: 'user_id', as: 'usuario' });

Room.hasMany(Reservation, { foreignKey: 'room_id', as: 'reservas' });
Reservation.belongsTo(Room, { foreignKey: 'room_id', as: 'sala' });

module.exports = Reservation;