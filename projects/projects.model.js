const Sequelize = require('sequelize');
const sequelize = require('../database');

const Project = sequelize.define('projects', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  title: {
    type: Sequelize.STRING,
    allowNull: false
  },

  thumbnail: {
    type: Sequelize.STRING,
    allowNull: true
  },

  videoLink: {
    type: Sequelize.STRING,
    allowNull: true
  },

  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },

  categoryId: {
    type: Sequelize.JSON,
    allowNull: false,
    defaultValue: []
  },
  year:{
    type: Sequelize.TEXT,
    allowNull: true,
  },
  client:{
    type: Sequelize.TEXT,
    allowNull: true,    
  },
  mainCategory:{
    type: Sequelize.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true
});

module.exports = Project;