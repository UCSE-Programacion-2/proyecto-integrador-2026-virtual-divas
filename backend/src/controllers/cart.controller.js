const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Producto = require('../models/Product');

const esIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

const obtenerOCrearCarrito = async (userId) => {
  const existente = await Cart.findOne({ user: userId });
  return existente || Cart.create({ user: userId, items: [] });
};

// Devuelve el carrito con los datos del producto y los totales
const formatearCarrito = async (cart) => {
  await cart.populate('items.product');
  const items = cart.items
    .filter((item) => item.product) // si el producto se borró, no se muestra
    .map((item) => ({
      productId: item.product._id,
      nombre: item.product.nombre,
      marca: item.product.marca,
      categoria: item.product.categoria,
      precio: item.product.precio,
      imagen: item.product.imagen,
      stock: item.product.stock,
      quantity: item.quantity,
      subtotal: item.product.precio * item.quantity,
    }));

  return { items, total: items.reduce((total, item) => total + item.subtotal, 0) };
};

const leerCantidad = (valor, porDefecto) => {
  const cantidad = valor === undefined ? porDefecto : Number(valor);
  return Number.isInteger(cantidad) ? cantidad : NaN;
};

const obtenerCarrito = async (req, res) => {
  try {
    const cart = await obtenerOCrearCarrito(req.user.id);
    return res.json(await formatearCarrito(cart));
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener el carrito' });
  }
};

const agregarItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const quantity = leerCantidad(req.body.quantity, 1);

    if (!esIdValido(productId) || !(quantity >= 1)) {
      return res.status(400).json({ mensaje: 'productId y quantity (mayor a 0) son obligatorios' });
    }

    const producto = await Producto.findById(productId);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    const cart = await obtenerOCrearCarrito(req.user.id);
    const item = cart.items.find((i) => i.product.toString() === productId);

    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    return res.status(201).json(await formatearCarrito(cart));
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al agregar al carrito' });
  }
};

const actualizarCantidad = async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity = leerCantidad(req.body.quantity);

    if (!(quantity >= 0)) {
      return res.status(400).json({ mensaje: 'quantity debe ser un número entero' });
    }

    const cart = await obtenerOCrearCarrito(req.user.id);
    const item = cart.items.find((i) => i.product.toString() === productId);

    if (!item) {
      return res.status(404).json({ mensaje: 'El producto no está en el carrito' });
    }

    if (quantity === 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    return res.json(await formatearCarrito(cart));
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar el carrito' });
  }
};

const eliminarItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await obtenerOCrearCarrito(req.user.id);
    const cantidadAntes = cart.items.length;

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);

    if (cart.items.length === cantidadAntes) {
      return res.status(404).json({ mensaje: 'El producto no está en el carrito' });
    }

    await cart.save();
    return res.json(await formatearCarrito(cart));
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar del carrito' });
  }
};

// Reemplaza el carrito completo (lo usa el frontend para sincronizar)
const reemplazarCarrito = async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : null;

    if (!items) {
      return res.status(400).json({ mensaje: 'items debe ser un array' });
    }

    const limpios = items
      .map((i) => ({ product: i.productId, quantity: leerCantidad(i.quantity, 1) }))
      .filter((i) => esIdValido(i.product) && i.quantity >= 1);

    const existentes = await Producto.find({ _id: { $in: limpios.map((i) => i.product) } });
    const idsExistentes = new Set(existentes.map((p) => p._id.toString()));

    const cart = await obtenerOCrearCarrito(req.user.id);
    cart.items = limpios.filter((i) => idsExistentes.has(String(i.product)));
    await cart.save();

    return res.json(await formatearCarrito(cart));
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al guardar el carrito' });
  }
};

const vaciarCarrito = async (req, res) => {
  try {
    const cart = await obtenerOCrearCarrito(req.user.id);
    cart.items = [];
    await cart.save();
    return res.json({ items: [], total: 0 });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al vaciar el carrito' });
  }
};

module.exports = {
  obtenerCarrito,
  agregarItem,
  actualizarCantidad,
  eliminarItem,
  reemplazarCarrito,
  vaciarCarrito,
};
