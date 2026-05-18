const Sequelize = require('sequelize');
const sequelize = require('../database');

const Category = sequelize.define('categories', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  parentId: {
    type: Sequelize.INTEGER,
    allowNull: true
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },

  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },

  slug: {
    type: Sequelize.STRING,
    allowNull: false
  }

}, {
  timestamps: false
});

module.exports = Category;