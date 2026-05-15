const express = require('express');
const router = express.Router();

const projectsService = require('./projects.service');

router.post('/', async (req, res) => {

  try {

    const project = await projectsService.create(req.body);

    res.json(project);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

router.get('/', async (req, res) => {

  try {

    const projects = await projectsService.findAll();

    res.json(projects);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

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

router.put('/:id', async (req, res) => {

  try {

    const project = await projectsService.update(
      req.params.id,
      req.body
    );

    res.json(project);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

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

module.exports = router;