const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./auth');
const productRoutes = require('./products');
const categoryRoutes = require('./categories');
const orderRoutes = require('./orders');
const cartRoutes = require('./cart');
const userRoutes = require('./users');

// Ruta de salud del API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API NUblack funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de información del API
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'NUblack API',
      description: 'API para tienda de ropa y calzado deportivo',
      version: '1.0.0',
      author: 'NUblack Team',
      endpoints: {
        auth: '/api/auth',
        products: '/api/products',
        categories: '/api/categories',
        orders: '/api/orders',
        cart: '/api/cart',
        users: '/api/users'
      },
      documentation: '/api/docs'
    }
  });
});

// Montar todas las rutas
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/users', userRoutes);

// Ruta 404 para rutas no encontradas
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/info',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/products',
      'GET /api/categories',
      'POST /api/orders',
      'GET /api/cart',
      'GET /api/users'
    ]
  });
});

module.exports = router;


