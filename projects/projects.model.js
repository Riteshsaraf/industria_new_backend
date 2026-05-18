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
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'categories', // table name
      key: 'id'
    },
    onDelete: 'CASCADE'
  }

}, {
  timestamps: true
});

module.exports = Project;