const express = require('express');
const router = express.Router();

const companyService = require('./company.service');
const projectService = require('./../projects/projects.service');
const imageService = require('../services/image.service');


const validate = require('../middleware/validate');

const createCompanyDto = require('./dto/create-company.dto');

const authMiddleware = require('../middleware/authMiddleware');

// =====================
// CREATE
// =====================
router.post('/', authMiddleware, validate(createCompanyDto), async (req, res) => {

  try {

    const dto = { ...req.body };

    // handle base64 banner image
    if (dto.bannerImage) {
      const fileName = await imageService.saveBase64Image(dto.bannerImage);
      dto.bannerImage = fileName;
    }

    const company = await companyService.create(dto);

    res.json(company);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================
// READ ALL
// =====================
router.get('/', async (req, res) => {

  try {

    const companies = await companyService.findAll();

    res.json(companies);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================
// READ ALL Home Page required detail
// =====================
router.get('/home', async (req, res) => {

  try {

    const homeDetails = await projectService.findHomeDetail();

    res.json(homeDetails);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});


// =====================
// READ ALL Social links  detail
// =====================
router.get('/social-info', async (req, res) => {

  try {

    const companyDetails = await projectService.findSocialLinks();

    res.json(companyDetails);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});

// =====================
// READ ONE (by name)
// =====================
router.get('/:name', async (req, res) => {

  try {

    const company = await companyService.findOne(req.params.name);

    if (!company) {
      return res.status(404).json({
        message: 'Company not found'
      });
    }

    res.json(company);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================
// DELETE
// =====================
router.delete('/:id', authMiddleware, async (req, res) => {

  try {

    await companyService.delete(req.params.id);

    res.json({
      message: 'Company deleted'
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;