const mongoose = require('mongoose');
const Order = require('../models/Order');
const Producto = require('../models/Product');
const Cart = require('../models/Cart');

const { ENVIO } = Order;

// Devuelve el stock descontado si algo falla a mitad de la compra
const devolverStock = async (descontados) => {
  await Promise.all(
    descontados.map((item) =>
      Producto.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } }),
    ),
  );
};

const crearPedido = async (req, res) => {
  const descontados = [];

  try {
    const { items, cliente, metodoPago } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ mensaje: 'El carrito está vacío' });
    }

    const pedidos = items.map((i) => ({ productId: i.productId, quantity: Number(i.quantity) }));
    const invalido = pedidos.find(
      (i) =>
        !mongoose.Types.ObjectId.isValid(i.productId) ||
        !Number.isInteger(i.quantity) ||
        i.quantity < 1,
    );
    if (invalido) {
      return res.status(400).json({ mensaje: 'Hay productos con datos inválidos' });
    }

    const lineas = [];

    // Descuenta stock producto por producto (solo si alcanza)
    // eslint-disable-next-line no-restricted-syntax
    for (const pedido of pedidos) {
      // eslint-disable-next-line no-await-in-loop
      const producto = await Producto.findOneAndUpdate(
        { _id: pedido.productId, stock: { $gte: pedido.quantity } },
        { $inc: { stock: -pedido.quantity } },
        { new: true },
      );

      if (!producto) {
        // eslint-disable-next-line no-await-in-loop
        await devolverStock(descontados);
        // eslint-disable-next-line no-await-in-loop
        const existe = await Producto.findById(pedido.productId);
        const mensaje = existe
          ? `No hay stock suficiente de "${existe.nombre}" (quedan ${existe.stock})`
          : 'Uno de los productos ya no existe';
        return res.status(400).json({ mensaje });
      }

      descontados.push({ product: producto._id, quantity: pedido.quantity });
      lineas.push({
        product: producto._id,
        nombre: producto.nombre,
        marca: producto.marca,
        precio: producto.precio,
        quantity: pedido.quantity,
        subtotal: producto.precio * pedido.quantity,
      });
    }

    const subtotal = lineas.reduce((total, linea) => total + linea.subtotal, 0);
    const order = await Order.create({
      user: req.user.id,
      items: lineas,
      cliente,
      metodoPago,
      subtotal,
      envio: ENVIO,
      total: subtotal + ENVIO,
    });

    // La compra vacía el carrito guardado del usuario
    await Cart.updateOne({ user: req.user.id }, { items: [] });

    return res.status(201).json({ mensaje: 'Compra realizada con éxito', order });
  } catch (error) {
    await devolverStock(descontados);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ mensaje: error.message });
    }
    return res.status(500).json({ mensaje: 'Error al crear el pedido' });
  }
};

const misPedidos = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener tus pedidos' });
  }
};

const obtenerPedido = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    const order = await Order.findById(req.params.id);
    const esDuenio = order && order.user.toString() === req.user.id;

    if (!order || (!esDuenio && req.user.role !== 'admin')) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener el pedido' });
  }
};

// Solo admin
const listarPedidos = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener los pedidos' });
  }
};

// Solo admin
const actualizarEstado = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true, runValidators: true },
    );

    if (!order) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    return res.json(order);
  } catch (error) {
    return res.status(400).json({ mensaje: 'Estado inválido' });
  }
};

module.exports = { crearPedido, misPedidos, obtenerPedido, listarPedidos, actualizarEstado };
