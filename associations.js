const Category = require('./categories/categories.model');
const Project = require('./projects/projects.model');

// =====================
// Category ↔ Project
// =====================

Category.hasMany(Project, {
  foreignKey: 'categoryId',
  as: 'projects'
});

Project.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

module.exports = {
  Category,
  Project
};