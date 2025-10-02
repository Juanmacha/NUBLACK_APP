const winston = require('winston');
const path = require('path');
require('dotenv').config();

// Crear directorio de logs si no existe
const logDir = path.join(__dirname, '../../logs');
require('fs').mkdirSync(logDir, { recursive: true });

// Configuración de formatos
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Configuración del logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'nublack-api' },
  transports: [
    // Archivo para todos los logs
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
      maxsize: parseInt(process.env.LOG_MAX_SIZE) || 20 * 1024 * 1024, // 20MB
      maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
      tailable: true
    }),
    
    // Archivo separado para errores
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: parseInt(process.env.LOG_MAX_SIZE) || 20 * 1024 * 1024,
      maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
      tailable: true
    })
  ]
});

// En desarrollo, también mostrar en consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Función para logging de requests HTTP
const logRequest = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user ? req.user.id : null
    };
    
    if (res.statusCode >= 400) {
      logger.error('HTTP Request Error', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });
  
  next();
};

// Función para logging de errores de la aplicación
const logError = (error, req = null) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    name: error.name
  };
  
  if (req) {
    errorData.request = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user ? req.user.id : null
    };
  }
  
  logger.error('Application Error', errorData);
};

// Función para logging de operaciones de base de datos
const logDatabase = (operation, table, data = {}) => {
  logger.info('Database Operation', {
    operation,
    table,
    data: JSON.stringify(data)
  });
};

// Función para logging de autenticación
const logAuth = (action, userId, success, details = {}) => {
  const level = success ? 'info' : 'warn';
  logger[level]('Authentication', {
    action,
    userId,
    success,
    details
  });
};

// Función para logging de emails
const logEmail = (action, recipient, success, details = {}) => {
  const level = success ? 'info' : 'error';
  logger[level]('Email', {
    action,
    recipient,
    success,
    details
  });
};

module.exports = {
  logger,
  logRequest,
  logError,
  logDatabase,
  logAuth,
  logEmail
};
