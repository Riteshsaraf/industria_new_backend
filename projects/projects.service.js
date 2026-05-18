const { Op } = require('sequelize');

const Project = require('./projects.model');
const Category = require('../categories/categories.model');

class ProjectsService {

  // =====================
  // CREATE
  // =====================
  async create(data) {
    return await Project.create(data);
  }


  // =====================
  // READ ALL (search + pagination + category join)
  // =====================
  async findAll(query = {}) {

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query.search || '';

    const offset = (page - 1) * limit;

    const where = search
      ? {
          title: {
            [Op.like]: `%${search}%`
          }
        }
      : {};

    const { rows, count } = await Project.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category'
        }
      ],
      limit,
      offset,
      order: [['id', 'DESC']]
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        lastPage: Math.ceil(count / limit)
      }
    };
  }


  // =====================
  // READ ONE
  // =====================
  async findOne(id) {

    return await Project.findOne({
      where: { id },
      include: [
        {
          model: Category,
          as: 'category'
        }
      ]
    });
  }


  // =====================
  // UPDATE
  // =====================
  async update(id, data) {

    await Project.update(data, {
      where: { id }
    });

    return await this.findOne(id);
  }


  // =====================
  // DELETE
  // =====================
  async delete(id) {

    return await Project.destroy({
      where: { id }
    });
  }
}

module.exports = new ProjectsService();