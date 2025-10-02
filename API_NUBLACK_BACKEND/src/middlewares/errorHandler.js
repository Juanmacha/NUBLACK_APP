const { logError } = require('../config/logger');

// Middleware para manejo de errores
const errorHandler = (err, req, res, next) => {
  // Log del error
  logError(err, req);

  // Error de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación de datos',
      errors: err.errors.map(error => ({
        field: error.path,
        message: error.message,
        value: error.value
      }))
    });
  }

  // Error de restricción única de Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'campo';
    return res.status(409).json({
      success: false,
      message: `El ${field} ya existe`,
      field: err.errors[0]?.path
    });
  }

  // Error de clave foránea de Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida en los datos'
    });
  }

  // Error de conexión a base de datos
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      success: false,
      message: 'Error de conexión a la base de datos'
    });
  }

  // Error de timeout de base de datos
  if (err.name === 'SequelizeTimeoutError') {
    return res.status(504).json({
      success: false,
      message: 'Timeout en la operación de base de datos'
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
  }

  // Error de multer (subida de archivos)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'El archivo es demasiado grande'
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(413).json({
      success: false,
      message: 'Demasiados archivos'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Campo de archivo inesperado'
    });
  }

  // Error de rate limiting
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: 'Demasiadas solicitudes, intenta más tarde'
    });
  }

  // Error de permisos
  if (err.status === 403) {
    return res.status(403).json({
      success: false,
      message: err.message || 'No tienes permisos para realizar esta acción'
    });
  }

  // Error de autenticación
  if (err.status === 401) {
    return res.status(401).json({
      success: false,
      message: err.message || 'No autorizado'
    });
  }

  // Error de recurso no encontrado
  if (err.status === 404) {
    return res.status(404).json({
      success: false,
      message: err.message || 'Recurso no encontrado'
    });
  }

  // Error de validación personalizado
  if (err.status === 400) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Datos de entrada inválidos'
    });
  }

  // Error interno del servidor (por defecto)
  const statusCode = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Error interno del servidor' 
    : err.message || 'Error interno del servidor';

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

// Middleware para manejar rutas no encontradas
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`
  });
};

// Middleware para manejar errores asíncronos
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Función para crear errores personalizados
const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.status = statusCode;
  return error;
};

// Función para manejar errores de base de datos
const handleDatabaseError = (err) => {
  if (err.name === 'SequelizeValidationError') {
    return createError('Datos de entrada inválidos', 400);
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    return createError('El recurso ya existe', 409);
  }
  
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return createError('Referencia inválida', 400);
  }
  
  if (err.name === 'SequelizeConnectionError') {
    return createError('Error de conexión a la base de datos', 503);
  }
  
  return createError('Error de base de datos', 500);
};

// Función para manejar errores de autenticación
const handleAuthError = (message = 'No autorizado') => {
  return createError(message, 401);
};

// Función para manejar errores de autorización
const handleAuthorizationError = (message = 'No tienes permisos para realizar esta acción') => {
  return createError(message, 403);
};

// Función para manejar errores de recurso no encontrado
const handleNotFoundError = (resource = 'Recurso') => {
  return createError(`${resource} no encontrado`, 404);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  createError,
  handleDatabaseError,
  handleAuthError,
  handleAuthorizationError,
  handleNotFoundError
};


