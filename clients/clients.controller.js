const express = require('express');
const router = express.Router();

const clientService = require('./clients.service');
const imageService = require('../services/image.service');


const validate = require('../middlewares/validate');

const createClientDto = require('./dto/create-client.dto');

const updateClientDto = require('./dto/update-client.dto');




// =====================
// CREATE
// =====================
router.post('/', validate(createClientDto), async (req, res) => {

  try {

    const dto = { ...req.body };

    // base64 image handling (same as NestJS logic)
    if (dto.image) {
      const fileName = await imageService.saveBase64Image(dto.image, false);
      dto.image = fileName;
    }

    const client = await clientService.create(dto);

    res.json(client);

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

    const clients = await clientService.findAll(req.query);

    res.json(clients);

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

    const client = await clientService.findOne(req.params.id);

    if (!client) {
      return res.status(404).json({
        message: 'Client not found'
      });
    }

    res.json(client);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================
// UPDATE
// =====================
router.patch('/:id', validate(updateClientDto), async (req, res) => {

  try {


     const dto = { ...req.body };

    // base64 image handling (same as NestJS logic)
    if (dto.image) {
      const fileName = await imageService.saveBase64Image(dto.image, false);
      dto.image = fileName;
    }

    console.log({updatedDTO : dto});

    const client = await clientService.update(
      req.params.id,
      dto
    );

    res.json(client);

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

    await clientService.delete(req.params.id);

    res.json({
      message: 'Client deleted'
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;