const Sequelize = require('sequelize');
const sequelize = require('../database');

const Company = sequelize.define('company', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  bannerImage: {
    type: Sequelize.STRING,
    allowNull: false
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },

  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },

  branches: {
    type: Sequelize.JSON,
    allowNull: true
  },

  socialLinks: {
    type: Sequelize.JSON,
    allowNull: true
  }

}, {
  timestamps: false
});

module.exports = Company;