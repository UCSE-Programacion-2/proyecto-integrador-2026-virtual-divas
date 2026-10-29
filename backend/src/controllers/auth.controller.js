const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const crearToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ mensaje: 'Nombre, email y contraseña son obligatorios' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const existe = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya existe una cuenta con ese email' });
    }

    const hash = await bcrypt.hash(password, 10);
    // El rol siempre es "user": los admin se crean con el seed
    const user = await User.create({ name, email, password: hash, role: 'user' });

    return res.status(201).json({
      mensaje: 'Usuario creado con éxito',
      token: crearToken(user),
      user: user.toPublic(),
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ mensaje: error.message });
    }
    return res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select(
      '+password',
    );
    const passwordOk = user && (await bcrypt.compare(password, user.password));

    if (!passwordOk) {
      return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    return res.json({ token: crearToken(user), user: user.toPublic() });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    return res.json({ user: user.toPublic() });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener usuario' });
  }
};

module.exports = { register, login, me };
