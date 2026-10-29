const mongoose = require('mongoose');
const Producto = require('../models/Product');

// Escapa caracteres especiales para usar el texto en una RegExp
const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/products?categoria=interior&q=latex
const obtenerProductos = async (req, res) => {
  try {
    const categoria = req.query.categoria || req.query.category;
    const q = String(req.query.q || '').trim();
    const filtro = {};

    if (categoria) {
      filtro.categoria = categoria;
    }

    if (q) {
      const regex = new RegExp(escaparRegex(q), 'i');
      filtro.$or = [{ nombre: regex }, { marca: regex }, { descripcion: regex }];
    }

    const productos = await Producto.find(filtro).sort({ nombre: 1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    return res.json(producto);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener producto' });
  }
};

const crearProducto = async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear producto', error: error.message });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    return res.json(producto);
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    return res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
