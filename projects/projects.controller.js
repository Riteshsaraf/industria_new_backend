const express = require('express');
const router = express.Router();

const projectsService = require('./projects.service');
const imageService = require('../services/image.service');

const validate = require('../middlewares/validate');

const createProjectDto = require('./dto/create-project.dto');

const updateProjectDto = require('./dto/update-project.dto');

const usersService = require('../user/user.service');

const loginUserDto = require('../user/dto/user-login.dto');

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