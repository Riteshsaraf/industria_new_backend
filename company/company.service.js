const Company = require('./company.model');

class CompanyService {

  // =====================
  // CREATE (UPSERT by name)
  // =====================
  async create(data) {

    // Sequelize upsert (insert or update by unique key)
    await Company.upsert(data);

    // return updated/created record (same as NestJS behavior)
    if (data.name) {
      return await this.findOne(data.name);
    }

    return { message: 'Created successfully' };
  }


  // =====================
  // READ ALL
  // =====================
  async findAll() {
    return await Company.findAll();
  }


  // =====================
  // READ ONE (by name)
  // =====================
  async findOne(name) {
    return await Company.findOne({
      where: { name }
    });
  }


  // =====================
  // DELETE
  // =====================
  async delete(id) {
    return await Company.destroy({
      where: { id }
    });
  }
}

module.exports = new CompanyService();