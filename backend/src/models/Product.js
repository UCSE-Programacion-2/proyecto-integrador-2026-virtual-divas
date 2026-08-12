const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    marca: { type: String, required: true },
    categoria: {
      type: String,
      enum: ['interior', 'exterior', 'esmalte', 'accesorio'],
      required: true,
    },
    precio: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    descripcion: { type: String },
    imagen: { type: String, default: '' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Producto', productoSchema);
