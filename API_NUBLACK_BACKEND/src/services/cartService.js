const { Carrito, Producto } = require('../models');
const { logDatabase } = require('../config/logger');
const { createError } = require('../middlewares/errorHandler');

class CartService {
  // Obtener carrito del usuario
  static async getUserCart(usuarioId) {
    try {
      const carrito = await Carrito.findAll({
        where: { usuario_id: usuarioId },
        include: [{
          association: 'producto',
          where: { estado: 'activo' },
          required: true,
          include: [{
            association: 'categoria',
            attributes: ['id_categoria', 'nombre']
          }]
        }],
        order: [['created_at', 'DESC']]
      });

      // Calcular totales
      let subtotal = 0;
      let totalItems = 0;

      carrito.forEach(item => {
        const itemTotal = item.cantidad * item.producto.precio;
        subtotal += itemTotal;
        totalItems += item.cantidad;
      });

      logDatabase('get_user_cart', 'carrito', { usuarioId, items: carrito.length });

      return {
        success: true,
        data: {
          items: carrito,
          subtotal,
          totalItems,
          count: carrito.length
        }
      };
    } catch (error) {
      logDatabase('get_user_cart', 'carrito', { error: error.message });
      throw error;
    }
  }

  // Agregar producto al carrito
  static async addToCart(usuarioId, productoId, cantidad = 1, talla = null) {
    try {
      // Verificar que el producto existe y está activo
      const producto = await Producto.findByPk(productoId);
      if (!producto) {
        throw createError('Producto no encontrado', 404);
      }

      if (producto.estado !== 'activo') {
        throw createError('El producto no está disponible', 400);
      }

      if (producto.stock < cantidad) {
        throw createError('Stock insuficiente', 400);
      }

      // Buscar si el producto ya está en el carrito
      const existingItem = await Carrito.findOne({
        where: {
          usuario_id: usuarioId,
          producto_id: productoId,
          talla: talla
        }
      });

      if (existingItem) {
        // Actualizar cantidad
        const newQuantity = existingItem.cantidad + cantidad;
        
        if (producto.stock < newQuantity) {
          throw createError('Stock insuficiente para la cantidad solicitada', 400);
        }

        await existingItem.update({ cantidad: newQuantity });
        
        logDatabase('update_cart_item', 'carrito', { 
          usuarioId, 
          productoId, 
          cantidad: newQuantity 
        });

        return {
          success: true,
          message: 'Cantidad actualizada en el carrito',
          data: { item: existingItem }
        };
      } else {
        // Crear nuevo item en el carrito
        const newItem = await Carrito.create({
          usuario_id: usuarioId,
          producto_id: productoId,
          cantidad: cantidad,
          talla: talla
        });

        logDatabase('add_to_cart', 'carrito', { 
          usuarioId, 
          productoId, 
          cantidad 
        });

        return {
          success: true,
          message: 'Producto agregado al carrito',
          data: { item: newItem }
        };
      }
    } catch (error) {
      logDatabase('add_to_cart', 'carrito', { error: error.message });
      throw error;
    }
  }

  // Actualizar cantidad en el carrito
  static async updateCartItem(usuarioId, productoId, cantidad, talla = null) {
    try {
      if (cantidad <= 0) {
        return await this.removeFromCart(usuarioId, productoId, talla);
      }

      // Verificar que el producto existe y está activo
      const producto = await Producto.findByPk(productoId);
      if (!producto) {
        throw createError('Producto no encontrado', 404);
      }

      if (producto.estado !== 'activo') {
        throw createError('El producto no está disponible', 400);
      }

      if (producto.stock < cantidad) {
        throw createError('Stock insuficiente', 400);
      }

      // Buscar el item en el carrito
      const item = await Carrito.findOne({
        where: {
          usuario_id: usuarioId,
          producto_id: productoId,
          talla: talla
        }
      });

      if (!item) {
        throw createError('Producto no encontrado en el carrito', 404);
      }

      await item.update({ cantidad: cantidad });

      logDatabase('update_cart_item', 'carrito', { 
        usuarioId, 
        productoId, 
        cantidad 
      });

      return {
        success: true,
        message: 'Cantidad actualizada en el carrito',
        data: { item }
      };
    } catch (error) {
      logDatabase('update_cart_item', 'carrito', { error: error.message });
      throw error;
    }
  }

  // Eliminar producto del carrito
  static async removeFromCart(usuarioId, productoId, talla = null) {
    try {
      const whereClause = {
        usuario_id: usuarioId,
        producto_id: productoId
      };

      if (talla) {
        whereClause.talla = talla;
      }

      const item = await Carrito.findOne({ where: whereClause });
      
      if (!item) {
        throw createError('Producto no encontrado en el carrito', 404);
      }

      await item.destroy();

      logDatabase('remove_from_cart', 'carrito', { 
        usuarioId, 
        productoId 
      });

      return {
        success: true,
        message: 'Producto eliminado del carrito'
      };
    } catch (error) {
      logDatabase('remove_from_cart', 'carrito', { error: error.message });
      throw error;
    }
  }

  // Limpiar carrito del usuario
  static async clearCart(usuarioId) {
    try {
      const deletedCount = await Carrito.destroy({
        where: { usuario_id: usuarioId }
      });

      logDatabase('clear_cart', 'carrito', { 
        usuarioId, 
        deletedCount 
      });

      return {
        success: true,
        message: 'Carrito limpiado exitosamente',
        data: { deletedItems: deletedCount }
      };
    } catch (error) {
      logDatabase('clear_cart', 'carrito', { error: error.message });
      throw error;
    }
  }

  // Obtener cantidad de items en el carrito
  static async getCartItemCount(usuarioId) {
    try {
      const count = await Carrito.sum('cantidad', {
        where: { usuario_id: usuarioId }
      });

      return {
        success: true,
        data: { count: count || 0 }
      };
    } catch (error) {
      logDatabase('get_cart_item_count', 'carrito', { error: error.message });
      throw error;
    }
  }

  // Verificar disponibilidad de productos en el carrito
  static async validateCartItems(usuarioId) {
    try {
      const carrito = await Carrito.findAll({
        where: { usuario_id: usuarioId },
        include: [{
          association: 'producto',
          where: { estado: 'activo' },
          required: true
        }]
      });

      const unavailableItems = [];
      const lowStockItems = [];

      for (const item of carrito) {
        if (item.producto.stock < item.cantidad) {
          if (item.producto.stock === 0) {
            unavailableItems.push({
              item,
              reason: 'Producto agotado'
            });
          } else {
            lowStockItems.push({
              item,
              reason: `Solo quedan ${item.producto.stock} unidades disponibles`,
              availableStock: item.producto.stock
            });
          }
        }
      }

      logDatabase('validate_cart_items', 'carrito', { 
        usuarioId, 
        unavailable: unavailableItems.length,
        lowStock: lowStockItems.length
      });

      return {
        success: true,
        data: {
          isValid: unavailableItems.length === 0,
          unavailableItems,
          lowStockItems
        }
      };
    } catch (error) {
      logDatabase('validate_cart_items', 'carrito', { error: error.message });
      throw error;
    }
  }

  // Ajustar cantidades según stock disponible
  static async adjustCartQuantities(usuarioId) {
    try {
      const carrito = await Carrito.findAll({
        where: { usuario_id: usuarioId },
        include: [{
          association: 'producto',
          where: { estado: 'activo' },
          required: true
        }]
      });

      const adjustments = [];

      for (const item of carrito) {
        if (item.producto.stock < item.cantidad) {
          const newQuantity = Math.max(0, item.producto.stock);
          
          if (newQuantity === 0) {
            await item.destroy();
            adjustments.push({
              productoId: item.producto_id,
              action: 'removed',
              reason: 'Producto agotado'
            });
          } else {
            await item.update({ cantidad: newQuantity });
            adjustments.push({
              productoId: item.producto_id,
              action: 'adjusted',
              oldQuantity: item.cantidad,
              newQuantity: newQuantity,
              reason: 'Stock insuficiente'
            });
          }
        }
      }

      logDatabase('adjust_cart_quantities', 'carrito', { 
        usuarioId, 
        adjustments: adjustments.length
      });

      return {
        success: true,
        message: 'Carrito ajustado según disponibilidad',
        data: { adjustments }
      };
    } catch (error) {
      logDatabase('adjust_cart_quantities', 'carrito', { error: error.message });
      throw error;
    }
  }

  // Obtener resumen del carrito
  static async getCartSummary(usuarioId) {
    try {
      const carrito = await Carrito.findAll({
        where: { usuario_id: usuarioId },
        include: [{
          association: 'producto',
          where: { estado: 'activo' },
          required: true
        }]
      });

      let subtotal = 0;
      let totalItems = 0;
      let totalWeight = 0; // Peso estimado para envío

      carrito.forEach(item => {
        const itemTotal = item.cantidad * item.producto.precio;
        subtotal += itemTotal;
        totalItems += item.cantidad;
        // Peso estimado por producto (puedes ajustar según tu lógica)
        totalWeight += item.cantidad * 0.5; // 0.5kg por producto
      });

      // Calcular envío (ejemplo básico)
      const shippingCost = subtotal >= 200000 ? 0 : 15000;
      const total = subtotal + shippingCost;

      logDatabase('get_cart_summary', 'carrito', { 
        usuarioId, 
        subtotal, 
        totalItems 
      });

      return {
        success: true,
        data: {
          subtotal,
          shippingCost,
          total,
          totalItems,
          totalWeight,
          itemCount: carrito.length,
          freeShippingThreshold: 200000,
          isEligibleForFreeShipping: subtotal >= 200000
        }
      };
    } catch (error) {
      logDatabase('get_cart_summary', 'carrito', { error: error.message });
      throw error;
    }
  }
}

module.exports = CartService;


