const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
require('express-async-errors');
require('dotenv').config();

// Importar middlewares personalizados
const { errorHandler, notFoundHandler } = require('./src/middlewares/errorHandler');
const { logRequest } = require('./src/config/logger');
const {
  helmetConfig,
  mongoSanitize: sanitizeMongo,
  generalRateLimit,
  validateOrigin,
  validatePayloadSize,
  securityLogger
} = require('./src/middlewares/security');

// Importar rutas
const routes = require('./src/routes');

// Crear aplicación Express
const app = express();

// Configuración de confianza en proxies (para rate limiting correcto)
app.set('trust proxy', 1);

// Middlewares de seguridad
app.use(helmetConfig);
app.use(mongoSanitize());
app.use(sanitizeMongo);

// Middleware de CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware de compresión
app.use(compression());

// Middleware de logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(logRequest);

// Middleware de validación de origen
if (process.env.NODE_ENV === 'production') {
  app.use(validateOrigin);
}

// Middleware de validación de tamaño de payload
app.use(validatePayloadSize('10mb'));

// Middleware de logging de seguridad
app.use(securityLogger);

// Middleware de rate limiting
app.use(generalRateLimit);

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));

// Middleware para parsear URL-encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// Middleware para crear directorio de uploads si no existe
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware para crear directorio de logs si no existe
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Rutas de la API
app.use('/api', routes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a la API de NUblack',
    version: '1.0.0',
    documentation: '/api/info',
    health: '/api/health'
  });
});

// Middleware para manejar rutas no encontradas
app.use(notFoundHandler);

// Middleware para manejo de errores (debe ir al final)
app.use(errorHandler);

// Middleware para manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;
