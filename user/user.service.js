const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./user.model');

class UsersService {

  // =====================
  // CREATE USER
  // =====================
  async create(dto) {

    const hashedPassword = await bcrypt.hash(String(dto.password), 10);

    const user = await User.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword
    });

    return user;
  }


  // =====================
  // FIND ALL
  // =====================
  async findAll() {
    return await User.findAll({
      attributes: { exclude: ['password'] }
    });
  }


  // =====================
  // FIND ONE
  // =====================
  async findOne(id) {
    return await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
  }


  // =====================
  // UPDATE
  // =====================
  async update(id, dto) {

    // if password is being updated → hash it
    if (dto.password) {
      dto.password = await bcrypt.hash(String(dto.password), 10);
    }

    await User.update(dto, {
      where: { id }
    });

    return await this.findOne(id);
  }


  // =====================
  // DELETE
  // =====================
  async delete(id) {
    return await User.destroy({
      where: { id }
    });
  }


  // =====================
  // LOGIN
  // =====================
  async login(dto) {

    const user = await User.findOne({
      where: { email: dto.email }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    return token;
  }
}

module.exports = new UsersService();