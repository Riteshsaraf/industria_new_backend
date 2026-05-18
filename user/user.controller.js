const express = require('express');
const router = express.Router();

const usersService = require('./user.service');


const validate = require('../middlewares/validate');

const loginUserDto = require('./dto/user-login.dto');

// =====================
// CREATE USER
// =====================
router.post('/', async (req, res) => {

  try {

    const user = await usersService.create(req.body);

    res.json(user);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

// Get all users (with optional query)
router.get('/',  async (req, res) => {

  try {

    const users = await usersService.findAll();

    res.json(users);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================
// GET ONE USER
// =====================
router.get('/:id', async (req, res) => {

  try {

    const user = await usersService.findOne(req.params.id);

    res.json(user);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================
// UPDATE USER
// =====================
router.patch('/:id', async (req, res) => {

  try {

    const user = await usersService.update(
      req.params.id,
      req.body
    );

    res.json(user);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================
// DELETE USER
// =====================
router.delete('/:id', async (req, res) => {

  try {

    await usersService.delete(req.params.id);

    res.json({
      message: 'User deleted'
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================
// LOGIN
// =====================
router.post('/login', validate(loginUserDto), async (req, res) => {

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