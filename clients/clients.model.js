const Sequelize = require('sequelize');
const sequelize = require('../database');

const Client = sequelize.define('clients', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  title: {
    type: Sequelize.STRING,
    allowNull: false
  },

  link: {
    type: Sequelize.STRING,
    allowNull: true
  },

  image: {
    type: Sequelize.STRING,
    allowNull: true
  }

}, {
  timestamps: false
});

module.exports = Client;