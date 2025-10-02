const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const { authenticateToken } = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas del carrito
router.get('/', 
  CartController.getCart
);

router.post('/add', 
  CartController.addToCart
);

router.put('/update', 
  CartController.updateCartItem
);

router.delete('/remove', 
  CartController.removeFromCart
);

router.delete('/clear', 
  CartController.clearCart
);

router.get('/count', 
  CartController.getCartItemCount
);

router.get('/validate', 
  CartController.validateCartItems
);

router.put('/adjust', 
  CartController.adjustCartQuantities
);

router.get('/summary', 
  CartController.getCartSummary
);

module.exports = router;


