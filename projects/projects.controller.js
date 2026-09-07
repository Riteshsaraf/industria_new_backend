const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');

const projectsService = require('./projects.service');
const imageService = require('../services/image.service');

const categoriesService = require('../categories/categories.service');

const validate = require('../middlewares/validate');

const createProjectDto = require('./dto/create-project.dto');

const updateProjectDto = require('./dto/update-project.dto');

const usersService = require('../user/user.service');

const loginUserDto = require('../user/dto/user-login.dto');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  },
  fileFilter: (req, file, cb) => {

    const allowedExtensions = ['.xlsx', '.xls'];
    const extension = require('path')
      .extname(file.originalname)
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return cb(new Error('Only Excel files are allowed'));
    }

    cb(null, true);
  }
});


// =====================
// IMPORT PROJECTS FROM EXCEL
// =====================
router.post('/import-excel', upload.single('file'), async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: 'Excel file is required'
      });
    }

    // Read Excel file from memory
    const workbook = XLSX.read(req.file.buffer, {
      type: 'buffer'
    });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert Excel rows to JSON
    const projects = XLSX.utils.sheet_to_json(worksheet);

    if (!projects.length) {
      return res.status(400).json({
        message: 'Excel file is empty'
      });
    }

    // Create projects
    const createdProjects = [];

    //I want to loop through project and make categorynames unique array and then want to fetch single time a category ids 
    const categoryNames = new Set();
    for (const projectData of projects) {
      if (projectData.category) {
        projectData.category.split(',').forEach(name => {
          categoryNames.add(name.trim().toLowerCase());
        });
      }
    }

    const categoryIdsWithNames = await categoriesService.getIdsByNames([...categoryNames]);  

    for (const projectData of projects) {
      console.log('Importing project:', projectData);

      // Clean/prepare data if required
      const dto = {
        ...projectData
      };

      // handle thumbnail base64
      if (dto.image) {
        const fileName = await imageService.saveImageFromUrl(dto.image);
        dto.thumbnail = fileName;
        delete dto.image; // Remove the original image field if needed
      }

      //Here i want to fetch categoryIds based on the category names provided in the Excel file. Assuming the Excel file has a column named 'categoryNames' which contains comma-separated category names, we can fetch the corresponding category IDs from the database.
      if (dto.category) {
        const categoryNames = dto.category.split(',').map(name => name.trim().toLowerCase());
        const categoryIds = categoryIdsWithNames.filter(cat => categoryNames.includes(cat.name.toLowerCase())).map(cat => cat.id);

        dto.categoryId = categoryIds;
        delete dto.category; // Remove the original categoryNames field if needed
      }

      console.log('Prepared DTO for project creation:', dto);
      const project = await projectsService.create(dto);

      createdProjects.push(project);
    }

    res.status(201).json({
      message: 'Projects imported successfully',
      total: createdProjects.length,
      projects: createdProjects
    });

  } catch (err) {

    console.error('Excel import error:', err);

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================
// CREATE
// =====================
router.post('/', validate(createProjectDto), async (req, res) => {

  try {

    const dto = { ...req.body };

    // handle thumbnail base64
    if (dto.thumbnail) {
      const fileName = await imageService.saveBase64Image(dto.thumbnail);
      dto.thumbnail = fileName;
    }

    const project = await projectsService.create(dto);

    res.json(project);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================
// READ ALL (with query)
// =====================
router.get('/', async (req, res) => {

  try {

    const projects = await projectsService.findAll(req.query);

    res.json(projects);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================
// READ ONE
// =====================
router.get('/:id', async (req, res) => {

  try {

    const project = await projectsService.findOne(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    res.json(project);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================
// UPDATE
// =====================
router.patch('/:id', validate(updateProjectDto), async (req, res) => {

  try {

    const dto = { ...req.body };

    // handle thumbnail update
    if (dto.thumbnail) {
      const fileName = await imageService.saveBase64Image(dto.thumbnail);
      dto.thumbnail = fileName;
    }

    const project = await projectsService.update(req.params.id, dto);

    res.json(project);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================
// DELETE
// =====================
router.delete('/:id', async (req, res) => {

  try {

    await projectsService.delete(req.params.id);

    res.json({
      message: 'Project deleted'
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

router.post('/admin-login', validate(loginUserDto), async (req, res) => {

  try {

    const token = await usersService.login(req.body);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      maxAge: 1000 * 60 * 60, // 1 hour
      sameSite: 'lax'
    });

    res.json({
      message: 'Login successful',
      token
    });

  } catch (err) {

    res.status(401).json({
      error: err.message
    });

  }

});

module.exports = router;