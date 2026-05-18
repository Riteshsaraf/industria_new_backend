const { Op } = require('sequelize');
const Client = require('./clients.model');

class ClientService {

  // =====================
  // CREATE
  // =====================
  async create(data) {
    return await Client.create(data);
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
          title: {
            [Op.like]: `%${search}%`
          }
        }
      : {};

    const { rows, count } = await Client.findAndCountAll({
      where,
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
    return await Client.findByPk(id);
  }


  // =====================
  // UPDATE
  // =====================
  async update(id, data) {

    await Client.update(data, {
      where: { id }
    });

    return await Client.findByPk(id);
  }


  // =====================
  // DELETE
  // =====================
  async delete(id) {

    return await Client.destroy({
      where: { id }
    });
  }
}

module.exports = new ClientService();