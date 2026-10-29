// Ruta inexistente
const noEncontrado = (req, res) => {
  res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// Errores no controlados (ej: JSON mal formado en el body)
// eslint-disable-next-line no-unused-vars
const manejarErrores = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El body no es un JSON válido' });
  }
  console.error(err);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
};

module.exports = { noEncontrado, manejarErrores };
