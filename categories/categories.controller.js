const express = require('express');

const router = express.Router();

const categoryService = require('./categories.service');

const validate = require('../middlewares/validate');

const createCategoryDto = require('./dto/create-category.dto');

const updateCategoryDto = require('./dto/update-category.dto');

// CREATE
router.post('/', validate(createCategoryDto), async (req, res) => {

  try {

    const category = await categoryService.create(req.body);

    res.json(category);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// READ ALL
router.get('/', async (req, res) => {

  try {

    const categories = await categoryService.findAll(req.query);

    res.json(categories);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// READ ONE
router.get('/:id', async (req, res) => {

  try {

    const category = await categoryService.findOne(req.params.id);

    if (!category) {

      return res.status(404).json({
        message: 'Category not found'
      });

    }

    res.json(category);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// UPDATE
router.put('/:id', validate(updateCategoryDto), async (req, res) => {

  try {

    const category = await categoryService.update(
      req.params.id,
      req.body
    );

    res.json(category);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// DELETE
router.delete('/:id', async (req, res) => {

  try {

    await categoryService.delete(req.params.id);

    res.json({
      message: 'Category deleted'
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;