const Sequelize = require('sequelize');
const sequelize = require('../database');

const Project = sequelize.define('projects', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  description: {
    type: Sequelize.TEXT
  },

  status: {
    type: Sequelize.STRING,
    defaultValue: 'active'
  }

});

module.exports = Project;