const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { logAuth } = require('../config/logger');

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      logAuth('token_verification', null, false, { error: 'Token no proporcionado' });
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario en la base de datos
    const usuario = await Usuario.findByPk(decoded.id, {
      attributes: { exclude: ['password_hash', 'password_salt'] }
    });

    if (!usuario) {
      logAuth('token_verification', decoded.id, false, { error: 'Usuario no encontrado' });
      return res.status(401).json({
        success: false,
        message: 'Token inválido - Usuario no encontrado'
      });
    }

    if (usuario.estado !== 'activo') {
      logAuth('token_verification', usuario.id_usuario, false, { error: 'Usuario inactivo' });
      return res.status(401).json({
        success: false,
        message: 'Cuenta inactiva'
      });
    }

    req.user = usuario;
    logAuth('token_verification', usuario.id_usuario, true);
    next();
  } catch (error) {
    logAuth('token_verification', null, false, { error: error.message });
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para verificar roles específicos
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (!roles.includes(req.user.rol)) {
      logAuth('role_authorization', req.user.id_usuario, false, { 
        required_roles: roles, 
        user_role: req.user.rol 
      });
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    logAuth('role_authorization', req.user.id_usuario, true, { 
      required_roles: roles, 
      user_role: req.user.rol 
    });
    next();
  };
};

// Middleware para verificar si el usuario es administrador
const requireAdmin = authorizeRoles('administrador');

// Middleware para verificar si el usuario es administrador o empleado
const requireStaff = authorizeRoles('administrador', 'empleado');

// Middleware para verificar si el usuario puede acceder a sus propios recursos
const requireOwnershipOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  const resourceUserId = parseInt(req.params.userId || req.params.id);
  
  if (req.user.rol === 'administrador' || req.user.id_usuario === resourceUserId) {
    next();
  } else {
    logAuth('ownership_verification', req.user.id_usuario, false, { 
      resource_user_id: resourceUserId 
    });
    return res.status(403).json({
      success: false,
      message: 'Solo puedes acceder a tus propios recursos'
    });
  }
};

// Middleware opcional para autenticación (no falla si no hay token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.findByPk(decoded.id, {
        attributes: { exclude: ['password_hash', 'password_salt'] }
      });

      if (usuario && usuario.estado === 'activo') {
        req.user = usuario;
      }
    }
  } catch (error) {
    // Ignorar errores en autenticación opcional
  }

  next();
};

// Función para generar tokens
const generateTokens = (usuario) => {
  const payload = {
    id: usuario.id_usuario,
    email: usuario.email,
    rol: usuario.rol
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });

  return { accessToken, refreshToken };
};

// Función para verificar refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Refresh token inválido');
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  requireAdmin,
  requireStaff,
  requireOwnershipOrAdmin,
  optionalAuth,
  generateTokens,
  verifyRefreshToken
};


