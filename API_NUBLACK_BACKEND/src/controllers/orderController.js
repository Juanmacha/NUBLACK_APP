const OrderService = require('../services/orderService');
const { asyncHandler } = require('../middlewares/errorHandler');

class OrderController {
  // Crear nuevo pedido
  static createOrder = asyncHandler(async (req, res) => {
    const result = await OrderService.createOrder(req.body, req.user.id_usuario);
    res.status(201).json(result);
  });

  // Obtener pedidos del usuario
  static getUserOrders = asyncHandler(async (req, res) => {
    const result = await OrderService.getUserOrders(req.user.id_usuario, req.query);
    res.json(result);
  });

  // Obtener pedido por ID
  static getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await OrderService.getOrderById(id, req.user.id_usuario);
    res.json(result);
  });

  // Obtener pedido por número de pedido
  static getOrderByNumber = asyncHandler(async (req, res) => {
    const { numeroPedido } = req.params;
    const result = await OrderService.getOrderByNumber(numeroPedido);
    res.json(result);
  });

  // Actualizar estado del pedido (admin)
  static updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { estado, motivo_rechazo } = req.body;
    const result = await OrderService.updateOrderStatus(id, estado, motivo_rechazo);
    res.json(result);
  });

  // Cancelar pedido
  static cancelOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await OrderService.cancelOrder(id, req.user.id_usuario);
    res.json(result);
  });

  // Obtener todos los pedidos (admin)
  static getAllOrders = asyncHandler(async (req, res) => {
    const result = await OrderService.getAllOrders(req.query);
    res.json(result);
  });

  // Obtener estadísticas de pedidos (admin)
  static getOrderStats = asyncHandler(async (req, res) => {
    const { fecha_inicio, fecha_fin } = req.query;
    const result = await OrderService.getOrderStats(fecha_inicio, fecha_fin);
    res.json(result);
  });
}

module.exports = OrderController;


