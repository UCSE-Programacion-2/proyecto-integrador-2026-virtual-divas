const jwt = require('jsonwebtoken');

// Verifica el header "Authorization: Bearer <token>"
const verificarToken = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensaje: 'Tenés que iniciar sesión' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Sesión inválida o vencida' });
  }
};

// Se usa después de verificarToken
const soloAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ mensaje: 'Solo un administrador puede hacer esto' });
  }
  return next();
};

module.exports = { verificarToken, soloAdmin };
