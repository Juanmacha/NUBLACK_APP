const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');
const { logError } = require('../config/logger');

// Configuración de rate limiting
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Demasiadas solicitudes, intenta más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logError(new Error('Rate limit exceeded'), req);
      res.status(429).json({
        success: false,
        message: message || 'Demasiadas solicitudes, intenta más tarde'
      });
    }
  });
};

// Rate limit general
const generalRateLimit = createRateLimit(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests por ventana
  'Demasiadas solicitudes desde esta IP, intenta más tarde'
);

// Rate limit para autenticación
const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutos
  5, // 5 intentos de login por IP
  'Demasiados intentos de login, intenta más tarde'
);

// Rate limit para registro
const registerRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hora
  3, // 3 registros por IP por hora
  'Demasiados intentos de registro, intenta más tarde'
);

// Rate limit para recuperación de contraseña
const passwordResetRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hora
  3, // 3 intentos por IP por hora
  'Demasiados intentos de recuperación de contraseña, intenta más tarde'
);

// Configuración de Helmet para seguridad HTTP
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Middleware para sanitización de datos
const sanitizeData = (req, res, next) => {
  // Sanitizar datos de entrada
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

// Función para sanitizar objetos recursivamente
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? xss(obj) : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
  }
  
  return sanitized;
};

// Middleware para validar origen de requests
const validateOrigin = (req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'https://nublack.com'
  ];
  
  const origin = req.get('Origin') || req.get('Referer');
  
  if (origin) {
    const isAllowed = allowedOrigins.some(allowedOrigin => 
      origin.startsWith(allowedOrigin)
    );
    
    if (!isAllowed) {
      logError(new Error(`Request from unauthorized origin: ${origin}`), req);
      return res.status(403).json({
        success: false,
        message: 'Origen no autorizado'
      });
    }
  }
  
  next();
};

// Middleware para validar tamaño de payload
const validatePayloadSize = (maxSize = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.get('Content-Length') || '0');
    const maxSizeBytes = parseSize(maxSize);
    
    if (contentLength > maxSizeBytes) {
      return res.status(413).json({
        success: false,
        message: 'Payload demasiado grande'
      });
    }
    
    next();
  };
};

// Función para convertir tamaño a bytes
const parseSize = (size) => {
  const units = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };
  
  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const unit = match[2];
  
  return Math.floor(value * units[unit]);
};

// Middleware para logging de seguridad
const securityLogger = (req, res, next) => {
  const securityHeaders = {
    'user-agent': req.get('User-Agent'),
    'x-forwarded-for': req.get('X-Forwarded-For'),
    'x-real-ip': req.get('X-Real-IP'),
    'referer': req.get('Referer'),
    'origin': req.get('Origin')
  };
  
  // Detectar posibles ataques
  const suspiciousPatterns = [
    /script/i,
    /javascript/i,
    /vbscript/i,
    /onload/i,
    /onerror/i,
    /<script/i,
    /eval\(/i,
    /expression\(/i
  ];
  
  const requestData = JSON.stringify({ ...req.body, ...req.query, ...req.params });
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestData));
  
  if (isSuspicious) {
    logError(new Error('Suspicious request detected'), req);
  }
  
  next();
};

// Middleware para prevenir ataques de fuerza bruta
const bruteForceProtection = (req, res, next) => {
  const attempts = req.session?.loginAttempts || 0;
  const lastAttempt = req.session?.lastLoginAttempt || 0;
  const now = Date.now();
  
  // Reset attempts after 15 minutes
  if (now - lastAttempt > 15 * 60 * 1000) {
    req.session.loginAttempts = 0;
  }
  
  // Block after 5 failed attempts
  if (attempts >= 5) {
    return res.status(429).json({
      success: false,
      message: 'Demasiados intentos fallidos, intenta más tarde'
    });
  }
  
  next();
};

// Middleware para validar headers de seguridad
const validateSecurityHeaders = (req, res, next) => {
  const requiredHeaders = ['user-agent'];
  const missingHeaders = requiredHeaders.filter(header => !req.get(header));
  
  if (missingHeaders.length > 0) {
    logError(new Error(`Missing required headers: ${missingHeaders.join(', ')}`), req);
    return res.status(400).json({
      success: false,
      message: 'Headers de seguridad requeridos'
    });
  }
  
  next();
};

module.exports = {
  generalRateLimit,
  authRateLimit,
  registerRateLimit,
  passwordResetRateLimit,
  helmetConfig,
  mongoSanitize,
  sanitizeData,
  validateOrigin,
  validatePayloadSize,
  securityLogger,
  bruteForceProtection,
  validateSecurityHeaders
};


