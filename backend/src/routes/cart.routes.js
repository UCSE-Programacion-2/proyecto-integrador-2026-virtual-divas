const express = require('express');

const router = express.Router();
const {
  obtenerCarrito,
  agregarItem,
  actualizarCantidad,
  eliminarItem,
  reemplazarCarrito,
  vaciarCarrito,
} = require('../controllers/cart.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// Todas las rutas del carrito requieren sesión
router.use(verificarToken);

router.get('/', obtenerCarrito);
router.put('/', reemplazarCarrito);
router.delete('/', vaciarCarrito);
router.post('/items', agregarItem);
router.patch('/items/:productId', actualizarCantidad);
router.delete('/items/:productId', eliminarItem);

module.exports = router;
