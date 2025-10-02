const ProductService = require('../services/productService');
const { asyncHandler } = require('../middlewares/errorHandler');

class ProductController {
  // Obtener todos los productos
  static getProducts = asyncHandler(async (req, res) => {
    const result = await ProductService.getProducts(req.query);
    res.json(result);
  });

  // Obtener producto por ID
  static getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ProductService.getProductById(id);
    res.json(result);
  });

  // Crear nuevo producto
  static createProduct = asyncHandler(async (req, res) => {
    const result = await ProductService.createProduct(req.body);
    res.status(201).json(result);
  });

  // Actualizar producto
  static updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ProductService.updateProduct(id, req.body);
    res.json(result);
  });

  // Eliminar producto
  static deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ProductService.deleteProduct(id);
    res.json(result);
  });

  // Obtener productos destacados
  static getFeaturedProducts = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;
    const result = await ProductService.getFeaturedProducts(limit);
    res.json(result);
  });

  // Obtener productos más vendidos
  static getBestSellingProducts = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;
    const result = await ProductService.getBestSellingProducts(limit);
    res.json(result);
  });

  // Obtener productos con descuento
  static getDiscountedProducts = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;
    const result = await ProductService.getDiscountedProducts(limit);
    res.json(result);
  });

  // Buscar productos
  static searchProducts = asyncHandler(async (req, res) => {
    const { q, ...filters } = req.query;
    const result = await ProductService.searchProducts(q, filters);
    res.json(result);
  });

  // Actualizar stock de producto
  static updateStock = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;
    const result = await ProductService.updateStock(id, cantidad);
    res.json(result);
  });

  // Obtener estadísticas de productos
  static getProductStats = asyncHandler(async (req, res) => {
    const result = await ProductService.getProductStats();
    res.json(result);
  });
}

module.exports = ProductController;


