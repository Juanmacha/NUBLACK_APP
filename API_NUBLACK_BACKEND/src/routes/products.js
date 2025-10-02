const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const {
  validateProduct,
  validateId,
  validatePagination,
  validateSearch
} = require('../middlewares/validation');
const {
  authenticateToken,
  requireAdmin,
  requireStaff,
  optionalAuth
} = require('../middlewares/auth');

// Rutas públicas
router.get('/', 
  optionalAuth,
  validatePagination,
  validateSearch,
  ProductController.getProducts
);

router.get('/featured', 
  ProductController.getFeaturedProducts
);

router.get('/best-selling', 
  ProductController.getBestSellingProducts
);

router.get('/discounted', 
  ProductController.getDiscountedProducts
);

router.get('/search', 
  validateSearch,
  ProductController.searchProducts
);

router.get('/:id', 
  validateId,
  ProductController.getProductById
);

// Rutas protegidas (solo staff)
router.use(authenticateToken);
router.use(requireStaff);

router.post('/', 
  validateProduct,
  ProductController.createProduct
);

router.put('/:id', 
  validateId,
  validateProduct,
  ProductController.updateProduct
);

router.delete('/:id', 
  validateId,
  ProductController.deleteProduct
);

router.put('/:id/stock', 
  validateId,
  ProductController.updateStock
);

// Rutas solo para administradores
router.get('/stats/overview', 
  requireAdmin,
  ProductController.getProductStats
);

module.exports = router;


