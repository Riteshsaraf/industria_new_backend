const { Op } = require('sequelize');

const Project = require('./projects.model');
const Category = require('../categories/categories.model');
const Company = require('../company/company.model');

class ProjectsService {

  // =====================
  // CREATE
  // =====================
  async create(data) {
    // Check if project already exists by title
    const existingProject = await Project.findOne({
      where: {
        title: data.title
      }
    });

    // If exists → update
    if (existingProject) {
      await existingProject.update(data);

      return await this.findOne(existingProject.id);
    }

    // If not exists → create
    return await Project.create(data);
  }

  // =====================
  // HELPER
  // =====================
  getCategoryIds(categoryId) {

    if (!categoryId) {
      return [];
    }

    // If categoryId is already an array
    if (Array.isArray(categoryId)) {
      return categoryId
        .map(Number)
        .filter(Boolean);
    }

    // If categoryId is stored as comma-separated string
    return String(categoryId)
      .split(',')
      .map(Number)
      .filter(Boolean);

  }


  // =====================
  // READ ALL
  // =====================
  async findAll(query = {}) {

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const slug = query.slug !== 'null' ? query.slug : null;
    const search = query.search!=='null' &&  query.search!=='undefined' ? query.search :'';

    const offset = (page - 1) * limit;

    console.log('🔍 Searching projects with:', {
      page,
      limit,
      slug,
      search
    });


    // =====================
    // PROJECT WHERE
    // =====================
    const where = {};

    // Search by title
    if (search) {
      where.title = {
        [Op.like]: `%${search}%`
      };
    }


    // =====================
    // CATEGORY SLUG FILTER
    // =====================
    let categoryIdsForFilter = [];

    if (slug !== null) {

      // Find category using slug
      const categories = await Category.findAll({
        where: {
          slug
        },
        attributes: ['id']
      });

      categoryIdsForFilter = categories.map(category => category.id);

      // No category found
      if (!categoryIdsForFilter.length) {
        return {
          data: [],
          meta: {
            total: 0,
            page,
            limit,
            lastPage: 0
          }
        };
      }
    }


    // =====================
    // GET ALL PROJECTS
    // =====================
    const { rows: projects } = await Project.findAndCountAll({
      where,
      order: [['updatedAt', 'DESC']]
    });


    // =====================
    // FILTER BY CATEGORY
    // =====================
    let filteredProjects = projects;

    if (categoryIdsForFilter.length) {

      filteredProjects = projects.filter(project => {

        const projectCategoryIds = project.categoryId || [];

        return categoryIdsForFilter.some(categoryId =>
          projectCategoryIds.includes(categoryId)
        );
      });
    }


    // =====================
    // PAGINATION
    // =====================
    const total = filteredProjects.length;

    const paginatedProjects = filteredProjects.slice(
      offset,
      offset + limit
    );


    // =====================
    // GET ALL CATEGORY IDS
    // =====================
    const allCategoryIds = [
      ...new Set(
        paginatedProjects.reduce((ids, project) => {

          const categoryIds =
            this.getCategoryIds(project.categoryId);

          return ids.concat(categoryIds);

        }, [])
      )
    ];

    // =====================
    // GET CATEGORIES
    // =====================
    let categories = [];

    if (allCategoryIds.length) {

      categories = await Category.findAll({
        where: {
          id: {
            [Op.in]: allCategoryIds
          }
        }
      });
    }


    // =====================
    // ADD CATEGORY TO PROJECT
    // =====================
    const data = paginatedProjects.map(project => {

      const projectJson = project.toJSON();

      projectJson.category = categories.filter(category =>
        (project.categoryId || []).includes(category.id)
      );

      return projectJson;
    });


    // =====================
    // RESPONSE
    // =====================
    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit)
      }
    };
  }


  async findHomeDetail(){

    const { rows: projects } = await Project.findAndCountAll({
      limit:6,
      order: [['updatedAt', 'DESC']]
    });

   // GET ALL CATEGORY IDS
    // =====================
    const allCategoryIds = [
      ...new Set(
        projects.reduce((ids, project) => {

          const categoryIds =
            this.getCategoryIds(project.categoryId);

          return ids.concat(categoryIds);

        }, [])
      )
    ];

    // =====================
    // GET CATEGORIES
    // =====================
    let categories = [];

    if (allCategoryIds.length) {

      categories = await Category.findAll({
        where: {
          id: {
            [Op.in]: allCategoryIds
          }
        }
      });
    }


    // =====================
    // ADD CATEGORY TO PROJECT
    // =====================
    const data = projects.map(project => {

      const projectJson = project.toJSON();

      projectJson.category = categories.filter(category =>
        (project.categoryId || []).includes(category.id)
      );

      return projectJson;
    });


    const companyInfo = await Company.findOne({});

    return {
      projects : data,
      companyInfo
    }
  }

  async findSocialLinks(){

    const companyInfo = await Company.findOne({});

    return {
      companyInfo
    }
  }

  // =====================
  // READ ONE
  // =====================
  async findOne(id) {

    const project = await Project.findOne({
      where: {
        id
      }
    });

    if (!project) {
      return null;
    }

    const projectJson = project.toJSON();

    const categoryIds = project.categoryId ? project.categoryId.split(',') : [];


    // =====================
    // GET CATEGORIES
    // =====================
    projectJson.category = [];

    if (categoryIds.length) {

      projectJson.category = await Category.findAll({
        where: {
          id: {
            [Op.in]: categoryIds
          }
        }
      });
    }


    return projectJson;
  }


  // =====================
  // UPDATE
  // =====================
  async update(id, data) {

    const project = await Project.findOne({
      where: {
        id
      }
    });

    if (!project) {
      return null;
    }

    await project.update(data);

    return await this.findOne(id);
  }


  // =====================
  // DELETE
  // =====================
  async delete(id) {

    return await Project.destroy({
      where: {
        id
      }
    });
  }
}

module.exports = new ProjectsService();
