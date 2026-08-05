const mongoose = require('mongoose')
const dotenv = require('dotenv')

const path = require('path')
dotenv.config({ path: path.join(__dirname, '../.env') })

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Conectado a MongoDB para seed'))
  .catch((err) => {
    console.error('Error de conexión:', err)
    process.exit(1)
  })


const productoSchema = new mongoose.Schema({
  nombre: String,
  marca: String,
  categoria: String,
  precio: Number,
  stock: Number,
  descripcion: String,
  imagen: String
})

const Producto = mongoose.model('Producto', productoSchema)

const productos = [
  { nombre: 'Pintura Látex Interior Blanco', marca: 'Sinteplast', categoria: 'interior', precio: 12500, stock: 50, descripcion: 'Pintura látex para interiores de alta cobertura', imagen: '' },
  { nombre: 'Pintura Látex Interior Marfil', marca: 'Sinteplast', categoria: 'interior', precio: 12800, stock: 30, descripcion: 'Pintura látex color marfil para interiores', imagen: '' },
  { nombre: 'Pintura Exterior Blanco', marca: 'Alba', categoria: 'exterior', precio: 15200, stock: 40, descripcion: 'Pintura para exteriores resistente a la humedad', imagen: '' },
  { nombre: 'Pintura Exterior Rojo Colonial', marca: 'Tersuave', categoria: 'exterior', precio: 14900, stock: 25, descripcion: 'Pintura exterior color rojo colonial', imagen: '' },
  { nombre: 'Esmalte Sintético Negro Brillante', marca: 'Alba', categoria: 'esmalte', precio: 8900, stock: 60, descripcion: 'Esmalte para metal y madera, secado rápido', imagen: '' },
  { nombre: 'Esmalte Sintético Blanco Mate', marca: 'Sinteplast', categoria: 'esmalte', precio: 8500, stock: 45, descripcion: 'Esmalte mate para superficies de madera', imagen: '' },
  { nombre: 'Rodillo Antigota 23cm', marca: 'Genérico', categoria: 'accesorio', precio: 2400, stock: 100, descripcion: 'Rodillo antigota ideal para paredes lisas', imagen: '' },
  { nombre: 'Pincel Plano N°4', marca: 'Genérico', categoria: 'accesorio', precio: 850, stock: 200, descripcion: 'Pincel plano para detalles y marcos', imagen: '' },
  { nombre: 'Diluyente Universal 1L', marca: 'Genérico', categoria: 'accesorio', precio: 3200, stock: 80, descripcion: 'Diluyente para pinturas y esmaltes', imagen: '' },
  { nombre: 'Lija al Agua Grano 180', marca: 'Genérico', categoria: 'accesorio', precio: 450, stock: 300, descripcion: 'Lija al agua para preparación de superficies', imagen: '' }
]


const seed = async () => {
  try {
    await Producto.deleteMany()
    await Producto.insertMany(productos)
    console.log('✅ 10 productos insertados correctamente')
    process.exit(0)
  } catch (error) {
    console.error('Error al insertar productos:', error)
    process.exit(1)
  }
}

seed()