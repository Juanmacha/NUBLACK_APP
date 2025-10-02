const { body, param, query, validationResult } = require('express-validator');
const { Usuario, Producto, Categoria } = require('../models');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Validaciones para usuarios
const validateUserRegistration = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('apellido')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El apellido debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
  
  body('tipo_documento')
    .isIn(['Cédula de Ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'Tarjeta de Identidad'])
    .withMessage('Tipo de documento inválido'),
  
  body('documento')
    .trim()
    .isLength({ min: 8, max: 50 })
    .withMessage('El documento debe tener entre 8 y 50 caracteres')
    .matches(/^[0-9]+$/)
    .withMessage('El documento solo puede contener números')
    .custom(async (value) => {
      const existingUser = await Usuario.findByDocument(value);
      if (existingUser) {
        throw new Error('Este número de documento ya está registrado');
      }
      return true;
    }),
  
  body('telefono')
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('El teléfono debe tener entre 10 y 20 caracteres')
    .matches(/^[0-9]+$/)
    .withMessage('El teléfono solo puede contener números'),
  
  body('email')
    .isEmail()
    .withMessage('Formato de email inválido')
    .normalizeEmail()
    .custom(async (value) => {
      const existingUser = await Usuario.findByEmail(value);
      if (existingUser) {
        throw new Error('Este email ya está registrado');
      }
      return true;
    }),
  
  body('password')
    .isLength({ min: 7 })
    .withMessage('La contraseña debe tener al menos 7 caracteres')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage('La contraseña debe tener al menos una mayúscula y un caracter especial'),
  
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Formato de email inválido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  
  handleValidationErrors
];

const validateUserUpdate = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('apellido')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El apellido debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
  
  body('telefono')
    .optional()
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('El teléfono debe tener entre 10 y 20 caracteres')
    .matches(/^[0-9]+$/)
    .withMessage('El teléfono solo puede contener números'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Formato de email inválido')
    .normalizeEmail(),
  
  handleValidationErrors
];

// Validaciones para productos
const validateProduct = [
  body('nombre')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('El nombre debe tener entre 3 y 150 caracteres'),
  
  body('precio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  
  body('precio_original')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio original debe ser un número positivo'),
  
  body('descripcion')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  
  body('genero')
    .optional()
    .isIn(['Hombre', 'Mujer', 'Unisex'])
    .withMessage('Género inválido'),
  
  body('categoria_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de categoría inválido')
    .custom(async (value) => {
      if (value) {
        const categoria = await Categoria.findByPk(value);
        if (!categoria) {
          throw new Error('Categoría no encontrada');
        }
      }
      return true;
    }),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero no negativo'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('El rating debe estar entre 0 y 5'),
  
  handleValidationErrors
];

// Validaciones para categorías
const validateCategory = [
  body('nombre')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('El nombre debe tener entre 3 y 100 caracteres')
    .custom(async (value, { req }) => {
      const existingCategory = await Categoria.findByName(value);
      if (existingCategory && existingCategory.id_categoria !== req.params.id) {
        throw new Error('Ya existe una categoría con este nombre');
      }
      return true;
    }),
  
  body('descripcion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('estado')
    .optional()
    .isIn(['Activo', 'Inactivo'])
    .withMessage('Estado inválido'),
  
  handleValidationErrors
];

// Validaciones para solicitudes
const validateSolicitud = [
  body('nombre_cliente')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del cliente debe tener entre 2 y 100 caracteres'),
  
  body('documento_identificacion')
    .trim()
    .isLength({ min: 8, max: 50 })
    .withMessage('El documento debe tener entre 8 y 50 caracteres'),
  
  body('telefono_contacto')
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('El teléfono debe tener entre 10 y 20 caracteres')
    .matches(/^[0-9]+$/)
    .withMessage('El teléfono solo puede contener números'),
  
  body('correo_electronico')
    .optional()
    .isEmail()
    .withMessage('Formato de email inválido')
    .normalizeEmail(),
  
  body('direccion_envio')
    .trim()
    .isLength({ min: 10, max: 255 })
    .withMessage('La dirección debe tener entre 10 y 255 caracteres'),
  
  body('metodo_pago')
    .isIn(['Contra Entrega', 'Tarjeta', 'Transferencia', 'PSE'])
    .withMessage('Método de pago inválido'),
  
  body('total')
    .isFloat({ min: 0 })
    .withMessage('El total debe ser un número positivo'),
  
  body('productos')
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos un producto'),
  
  body('productos.*.producto_id')
    .isInt({ min: 1 })
    .withMessage('ID de producto inválido'),
  
  body('productos.*.cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo'),
  
  handleValidationErrors
];

// Validaciones para reseñas
const validateResena = [
  body('calificacion')
    .isInt({ min: 1, max: 5 })
    .withMessage('La calificación debe estar entre 1 y 5'),
  
  body('comentario')
    .optional()
    .isLength({ max: 500 })
    .withMessage('El comentario no puede exceder 500 caracteres'),
  
  handleValidationErrors
];

// Validaciones para parámetros
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID inválido'),
  
  handleValidationErrors
];

// Validaciones para consultas
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe estar entre 1 y 100'),
  
  handleValidationErrors
];

// Validaciones para búsqueda
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El término de búsqueda debe tener entre 2 y 100 caracteres'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateProduct,
  validateCategory,
  validateSolicitud,
  validateResena,
  validateId,
  validatePagination,
  validateSearch
};


