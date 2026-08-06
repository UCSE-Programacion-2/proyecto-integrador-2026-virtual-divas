const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('../config/db')

dotenv.config()

const app = express()

app.use(express.json())

const productRoutes = require('./routes/product.routes')

app.use('/api/products', productRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a la API de PintuNort' })
})

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`)
    })
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message)
    process.exit(1)
  }
}

startServer()