const { DataTypes } = require('sequelize');
const sequelize = require('../../../shared/database/connection');

const Room = sequelize.define('Room', {
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
    type: DataTypes.STRING, // Ex: "Projetor, TV, Wi-Fi"
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('ATIVA', 'INATIVA'),
    defaultValue: 'ATIVA',
    allowNull: false,
  },
}, {
  tableName: 'rooms',
  timestamps: true,
});

module.exports = Room;