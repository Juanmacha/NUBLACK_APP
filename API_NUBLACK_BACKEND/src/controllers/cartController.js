const CartService = require('../services/cartService');
const { asyncHandler } = require('../middlewares/errorHandler');

class CartController {
  // Obtener carrito del usuario
  static getCart = asyncHandler(async (req, res) => {
    const result = await CartService.getUserCart(req.user.id_usuario);
    res.json(result);
  });

  // Agregar producto al carrito
  static addToCart = asyncHandler(async (req, res) => {
    const { producto_id, cantidad, talla } = req.body;
    const result = await CartService.addToCart(
      req.user.id_usuario,
      producto_id,
      cantidad,
      talla
    );
    res.json(result);
  });

  // Actualizar cantidad en el carrito
  static updateCartItem = asyncHandler(async (req, res) => {
    const { producto_id, cantidad, talla } = req.body;
    const result = await CartService.updateCartItem(
      req.user.id_usuario,
      producto_id,
      cantidad,
      talla
    );
    res.json(result);
  });

  // Eliminar producto del carrito
  static removeFromCart = asyncHandler(async (req, res) => {
    const { producto_id, talla } = req.body;
    const result = await CartService.removeFromCart(
      req.user.id_usuario,
      producto_id,
      talla
    );
    res.json(result);
  });

  // Limpiar carrito
  static clearCart = asyncHandler(async (req, res) => {
    const result = await CartService.clearCart(req.user.id_usuario);
    res.json(result);
  });

  // Obtener cantidad de items en el carrito
  static getCartItemCount = asyncHandler(async (req, res) => {
    const result = await CartService.getCartItemCount(req.user.id_usuario);
    res.json(result);
  });

  // Verificar disponibilidad de productos en el carrito
  static validateCartItems = asyncHandler(async (req, res) => {
    const result = await CartService.validateCartItems(req.user.id_usuario);
    res.json(result);
  });

  // Ajustar cantidades según stock disponible
  static adjustCartQuantities = asyncHandler(async (req, res) => {
    const result = await CartService.adjustCartQuantities(req.user.id_usuario);
    res.json(result);
  });

  // Obtener resumen del carrito
  static getCartSummary = asyncHandler(async (req, res) => {
    const result = await CartService.getCartSummary(req.user.id_usuario);
    res.json(result);
  });
}

module.exports = CartController;


