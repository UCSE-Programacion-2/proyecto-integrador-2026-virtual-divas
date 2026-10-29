const mongoose = require('mongoose');

const ENVIO = 1500;

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    nombre: { type: String, required: true },
    marca: { type: String },
    precio: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: {
      type: [orderItemSchema],
      validate: [(items) => items.length > 0, 'El pedido debe tener al menos un producto'],
    },
    cliente: {
      nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
      apellido: { type: String, required: [true, 'El apellido es obligatorio'], trim: true },
      email: { type: String, required: [true, 'El email es obligatorio'], trim: true },
      telefono: { type: String, required: [true, 'El teléfono es obligatorio'], trim: true },
      direccion: { type: String, trim: true },
      ciudad: { type: String, trim: true },
      zona: { type: String, trim: true },
      notas: { type: String, trim: true },
    },
    metodoPago: {
      type: String,
      enum: ['efectivo', 'transferencia', 'tarjeta'],
      required: true,
    },
    subtotal: { type: Number, required: true },
    envio: { type: Number, default: ENVIO },
    total: { type: Number, required: true },
    estado: {
      type: String,
      enum: ['pendiente', 'preparando', 'entregado', 'cancelado'],
      default: 'pendiente',
    },
  },
  { timestamps: true },
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
module.exports.ENVIO = ENVIO;
