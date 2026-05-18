const { Op } = require('sequelize');
const Category = require('./categories.model');

class CategoryService {

  // =====================
  // CREATE
  // =====================
  async create(data) {
    try {
      return await Category.create(data);

    } catch (error) {

      console.log('🔥 DB ERROR:', error);

      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Category already exists');
      }

      throw error;
    }
  }


  // =====================
  // READ ALL (search + pagination)
  // =====================
  async findAll(query = {}) {

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query.search || '';

    const offset = (page - 1) * limit;

    const where = search
      ? {
          name: {
            [Op.like]: `%${search}%`
          }
        }
      : {};

    const { rows, count } = await Category.findAndCountAll({
      where,
      limit,
      offset
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
    return await Category.findByPk(id);
  }


  // =====================
  // UPDATE
  // =====================
  async update(id, data) {

    await Category.update(data, {
      where: { id }
    });

    return await Category.findByPk(id);
  }


  // =====================
  // DELETE
  // =====================
  async delete(id) {

    return await Category.destroy({
      where: { id }
    });
  }
}

module.exports = new CategoryService();