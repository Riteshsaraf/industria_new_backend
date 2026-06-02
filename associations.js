const Category = require('./categories/categories.model');
const Project = require('./projects/projects.model');

// =====================
// Category ↔ Project
// =====================

Category.hasMany(Project, {
  foreignKey: 'categoryId',
  as: 'projects'
});

Category.belongsTo(Category, {
  foreignKey: 'parentId',
  as: 'parent'
});

Category.hasMany(Category, {
  foreignKey: 'parentId',
  as: 'children'
});

Project.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

module.exports = {
  Category,
  Project
};