const express = require('express');

const router = express.Router();
const {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} = require('../controllers/product.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

// Escritura: solo administradores
router.post('/', verificarToken, soloAdmin, crearProducto);
router.put('/:id', verificarToken, soloAdmin, actualizarProducto);
router.delete('/:id', verificarToken, soloAdmin, eliminarProducto);

module.exports = router;
