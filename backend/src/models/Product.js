const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    marca: { type: String, required: [true, 'La marca es obligatoria'], trim: true },
    categoria: {
      type: String,
      enum: ['interior', 'exterior', 'esmalte', 'accesorio'],
      required: true,
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: { type: Number, default: 0, min: [0, 'El stock no puede ser negativo'] },
    descripcion: { type: String },
    imagen: { type: String, default: '' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Producto', productoSchema);
