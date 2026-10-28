const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('../config/db');
const swaggerDocument = require('./docs/swagger');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const productRoutes = require('./routes/product.routes');
const authRoutes = require('./routes/auth.routes');
const cartRoutes = require('./routes/cart.routes');
const { noEncontrado, manejarErrores } = require('./middlewares/error.middleware');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a la API de PintuNort' });
});

app.use(noEncontrado);
app.use(manejarErrores);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('Falta configurar la variable de entorno JWT_SECRET');
    }
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
