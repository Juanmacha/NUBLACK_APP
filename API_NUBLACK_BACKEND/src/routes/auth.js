const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateId
} = require('../middlewares/validation');
const {
  authRateLimit,
  passwordResetRateLimit,
  registerRateLimit
} = require('../middlewares/security');
const { authenticateToken } = require('../middlewares/auth');

// Rutas públicas
router.post('/register', 
  registerRateLimit,
  validateUserRegistration,
  AuthController.register
);

router.post('/login', 
  authRateLimit,
  validateUserLogin,
  AuthController.login
);

router.post('/refresh-token', 
  AuthController.refreshToken
);

router.post('/request-password-reset', 
  passwordResetRateLimit,
  AuthController.requestPasswordReset
);

router.post('/reset-password', 
  passwordResetRateLimit,
  AuthController.resetPassword
);

router.get('/verify-email/:token', 
  AuthController.verifyEmail
);

// Rutas protegidas
router.use(authenticateToken);

router.get('/profile', 
  AuthController.getProfile
);

router.put('/profile', 
  validateUserUpdate,
  AuthController.updateProfile
);

router.post('/change-password', 
  AuthController.changePassword
);

router.post('/logout', 
  AuthController.logout
);

module.exports = router;


