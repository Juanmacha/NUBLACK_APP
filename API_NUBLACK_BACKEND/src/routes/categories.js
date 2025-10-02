const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const {
  validateCategory,
  validateId,
  validatePagination
} = require('../middlewares/validation');
const {
  authenticateToken,
  requireAdmin,
  requireStaff
} = require('../middlewares/auth');

// Rutas públicas
router.get('/', 
  CategoryController.getCategories
);

router.get('/with-products', 
  CategoryController.getCategoriesWithProducts
);

router.get('/:id', 
  validateId,
  CategoryController.getCategoryById
);

// Rutas protegidas (solo staff)
router.use(authenticateToken);
router.use(requireStaff);

router.post('/', 
  validateCategory,
  CategoryController.createCategory
);

router.put('/:id', 
  validateId,
  validateCategory,
  CategoryController.updateCategory
);

router.delete('/:id', 
  validateId,
  CategoryController.deleteCategory
);

// Rutas solo para administradores
router.get('/stats/overview', 
  requireAdmin,
  CategoryController.getCategoryStats
);

module.exports = router;


