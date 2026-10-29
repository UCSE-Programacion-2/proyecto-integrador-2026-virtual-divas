const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('../config/db');
const swaggerDocument = require('./docs/swagger');

dotenv.config();

const app = express();

// CORS_ORIGIN: lista separada por comas (ej: https://pintunort.vercel.app,http://localhost:5173)
// Si no está definida, se permite cualquier origen (útil en desarrollo)
const origenesPermitidos = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origen) => origen.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: origenesPermitidos.length ? origenesPermitidos : true,
  }),
);
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const productRoutes = require('./routes/product.routes');
const authRoutes = require('./routes/auth.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const { noEncontrado, manejarErrores } = require('./middlewares/error.middleware');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a la API de PintuNort', docs: '/api-docs' });
});

// Lo usa Render para saber si el servicio está vivo
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: Math.round(process.uptime()) });
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
