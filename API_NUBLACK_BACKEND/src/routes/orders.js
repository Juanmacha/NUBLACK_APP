const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const {
  validateSolicitud,
  validateId,
  validatePagination
} = require('../middlewares/validation');
const {
  authenticateToken,
  requireAdmin,
  requireStaff
} = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas para usuarios autenticados
router.post('/', 
  validateSolicitud,
  OrderController.createOrder
);

router.get('/my-orders', 
  validatePagination,
  OrderController.getUserOrders
);

router.get('/my-orders/:id', 
  validateId,
  OrderController.getOrderById
);

router.post('/:id/cancel', 
  validateId,
  OrderController.cancelOrder
);

// Rutas públicas para consultar pedido por número
router.get('/track/:numeroPedido', 
  OrderController.getOrderByNumber
);

// Rutas para staff (empleados y administradores)
router.use(requireStaff);

router.get('/all', 
  validatePagination,
  OrderController.getAllOrders
);

router.put('/:id/status', 
  validateId,
  OrderController.updateOrderStatus
);

// Rutas solo para administradores
router.get('/stats/overview', 
  requireAdmin,
  OrderController.getOrderStats
);

module.exports = router;


