const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getSecret = () => process.env.JWT_SECRET || 'development-secret';

const serializeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
});

const createToken = (user) => jwt.sign({ userId: user._id.toString() }, getSecret(), { expiresIn: '7d' });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });

    return res.status(201).json({ token: createToken(user), user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo crear la cuenta' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() });

    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    return res.json({ token: createToken(user), user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo iniciar sesión' });
  }
};

const me = async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    return res.status(401).json({ message: 'Sesión inválida' });
  }

  return res.json({ user: serializeUser(user) });
};

module.exports = { register, login, me };
