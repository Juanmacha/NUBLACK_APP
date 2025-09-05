/**
 * Utilidades para formatear moneda colombiana (COP)
 */

/**
 * Formatea un número como precio en pesos colombianos
 * @param {number} amount - Cantidad a formatear
 * @param {boolean} showDecimals - Si mostrar decimales (por defecto false para COP)
 * @returns {string} Precio formateado en formato colombiano
 */
export const formatCOP = (amount, showDecimals = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$ 0';
  }
  
  const options = {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
    locale: 'es-CO'
  };
  
  return new Intl.NumberFormat('es-CO', options).format(amount);
};

/**
 * Formatea un número como precio en pesos colombianos sin símbolo de moneda
 * @param {number} amount - Cantidad a formatear
 * @param {boolean} showDecimals - Si mostrar decimales (por defecto false para COP)
 * @returns {string} Precio formateado sin símbolo de moneda
 */
export const formatCOPAmount = (amount, showDecimals = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }
  
  const options = {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
    locale: 'es-CO'
  };
  
  return new Intl.NumberFormat('es-CO', options).format(amount);
};

/**
 * Formatea un número como precio en pesos colombianos con símbolo $ personalizado
 * @param {number} amount - Cantidad a formatear
 * @param {boolean} showDecimals - Si mostrar decimales (por defecto false para COP)
 * @returns {string} Precio formateado con símbolo $ personalizado
 */
export const formatCOPCustom = (amount, showDecimals = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$ 0';
  }
  
  const formattedAmount = formatCOPAmount(amount, showDecimals);
  return `$ ${formattedAmount}`;
};

/**
 * Convierte un string de precio a número
 * @param {string} priceString - String del precio (ej: "$ 150,000")
 * @returns {number} Número del precio
 */
export const parseCOPPrice = (priceString) => {
  if (!priceString) return 0;
  
  // Remover símbolos de moneda y espacios
  const cleanString = priceString.replace(/[$\s]/g, '');
  
  // Remover comas de miles y convertir punto decimal
  const normalizedString = cleanString.replace(/\./g, '').replace(',', '.');
  
  const parsed = parseFloat(normalizedString);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Valida si un precio es válido para COP
 * @param {number} amount - Cantidad a validar
 * @returns {boolean} True si es válido
 */
export const isValidCOPPrice = (amount) => {
  return amount !== null && 
         amount !== undefined && 
         !isNaN(amount) && 
         amount >= 0 && 
         amount <= Number.MAX_SAFE_INTEGER;
};

/**
 * Redondea un precio a múltiplos de 100 (práctica común en Colombia)
 * @param {number} amount - Cantidad a redondear
 * @returns {number} Precio redondeado
 */
export const roundCOPPrice = (amount) => {
  if (!isValidCOPPrice(amount)) return 0;
  return Math.round(amount / 100) * 100;
};
