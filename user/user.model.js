const Sequelize = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false
  }

}, {
  timestamps: false
});

module.exports = User;