const Project = require('./projects.model');

class ProjectsService {

  async create(data) {
    return await Project.create(data);
  }

  async findAll() {
    return await Project.findAll();
  }

  async findOne(id) {
    return await Project.findByPk(id);
  }

  async update(id, data) {

    await Project.update(data, {
      where: { id: id }
    });

    return await Project.findByPk(id);
  }

  async delete(id) {

    return await Project.destroy({
      where: { id: id }
    });
  }

}

module.exports = new ProjectsService();