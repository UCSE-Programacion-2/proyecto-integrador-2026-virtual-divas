const express = require('express');

const router = express.Router();
const {
  crearPedido,
  misPedidos,
  obtenerPedido,
  listarPedidos,
  actualizarEstado,
} = require('../controllers/order.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

router.use(verificarToken);

router.post('/', crearPedido);
router.get('/mine', misPedidos);
router.get('/', soloAdmin, listarPedidos);
router.get('/:id', obtenerPedido);
router.patch('/:id/status', soloAdmin, actualizarEstado);

module.exports = router;
