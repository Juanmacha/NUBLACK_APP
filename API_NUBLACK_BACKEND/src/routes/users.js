const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const {
  validateUserRegistration,
  validateUserUpdate,
  validateId,
  validatePagination,
  validateSearch
} = require('../middlewares/validation');
const {
  authenticateToken,
  requireAdmin,
  requireOwnershipOrAdmin
} = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas para administradores
router.get('/', 
  requireAdmin,
  validatePagination,
  validateSearch,
  UserController.getUsers
);

router.get('/stats', 
  requireAdmin,
  UserController.getUserStats
);

router.get('/search', 
  requireAdmin,
  validateSearch,
  UserController.searchUsers
);

router.post('/', 
  requireAdmin,
  validateUserRegistration,
  UserController.createUser
);

router.get('/:id', 
  requireOwnershipOrAdmin,
  validateId,
  UserController.getUserById
);

router.put('/:id', 
  requireOwnershipOrAdmin,
  validateId,
  validateUserUpdate,
  UserController.updateUser
);

router.delete('/:id', 
  requireAdmin,
  validateId,
  UserController.deleteUser
);

router.put('/:id/status', 
  requireAdmin,
  validateId,
  UserController.changeUserStatus
);

module.exports = router;


