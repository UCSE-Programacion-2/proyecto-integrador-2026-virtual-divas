const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUrl = process.env.MONGODB_URI;

  if (!mongoUrl) {
    throw new Error('Falta configurar la variable de entorno MONGODB_URI');
  }

  await mongoose.connect(mongoUrl);
  console.log('Conectado a MongoDB');
};

module.exports = connectDB;
