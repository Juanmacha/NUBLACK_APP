const { Solicitud, DetalleSolicitud, Producto, Usuario } = require('../models');
const { sendOrderConfirmationEmail } = require('../config/email');
const { logDatabase } = require('../config/logger');
const { createError } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

class OrderService {
  // Crear nueva solicitud/pedido
  static async createOrder(orderData, usuarioId) {
    const transaction = await Solicitud.sequelize.transaction();
    
    try {
      // Generar número de pedido único
      const numeroPedido = `PED-${Date.now().toString(36).toUpperCase()}`;
      
      // Calcular totales
      let subtotal = 0;
      const productos = [];

      // Verificar productos y calcular totales
      for (const item of orderData.productos) {
        const producto = await Producto.findByPk(item.producto_id, { transaction });
        if (!producto) {
          throw createError(`Producto con ID ${item.producto_id} no encontrado`, 400);
        }

        if (producto.estado !== 'activo') {
          throw createError(`El producto ${producto.nombre} no está disponible`, 400);
        }

        if (producto.stock < item.cantidad) {
          throw createError(`Stock insuficiente para el producto ${producto.nombre}`, 400);
        }

        const itemTotal = producto.precio * item.cantidad;
        subtotal += itemTotal;

        productos.push({
          ...item,
          nombre_producto: producto.nombre,
          descripcion_producto: producto.descripcion,
          imagen_producto: producto.imagen,
          precio_unitario: producto.precio,
          subtotal: itemTotal
        });
      }

      const total = subtotal;

      // Crear solicitud
      const solicitud = await Solicitud.create({
        numero_pedido: numeroPedido,
        usuario_id: usuarioId,
        nombre_cliente: orderData.nombre_cliente,
        documento_identificacion: orderData.documento_identificacion,
        telefono_contacto: orderData.telefono_contacto,
        correo_electronico: orderData.correo_electronico,
        direccion_envio: orderData.direccion_envio,
        referencia_direccion: orderData.referencia_direccion,
        indicaciones_adicionales: orderData.indicaciones_adicionales,
        horario_preferido: orderData.horario_preferido,
        metodo_pago: orderData.metodo_pago,
        total: total,
        subtotal: subtotal,
        tiempo_estimado_entrega: orderData.tiempo_estimado_entrega,
        prioridad: orderData.prioridad || 'normal',
        notas_internas: orderData.notas_internas
      }, { transaction });

      // Crear detalles de la solicitud
      for (const item of productos) {
        await DetalleSolicitud.create({
          solicitud_id: solicitud.id_solicitud,
          producto_id: item.producto_id,
          nombre_producto: item.nombre_producto,
          descripcion_producto: item.descripcion_producto,
          imagen_producto: item.imagen_producto,
          cantidad: item.cantidad,
          talla: item.talla,
          precio_unitario: item.precio_unitario,
          subtotal: item.subtotal
        }, { transaction });

        // Actualizar stock del producto
        await Producto.update(
          { stock: Producto.sequelize.literal(`stock - ${item.cantidad}`) },
          { 
            where: { id_producto: item.producto_id },
            transaction 
          }
        );
      }

      await transaction.commit();

      // Enviar email de confirmación
      try {
        const usuario = await Usuario.findByPk(usuarioId);
        if (usuario && usuario.email) {
          await sendOrderConfirmationEmail(
            usuario.email,
            `${usuario.nombre} ${usuario.apellido}`,
            solicitud
          );
        }
      } catch (emailError) {
        console.error('Error enviando email de confirmación:', emailError);
        // No fallar la creación del pedido por error de email
      }

      logDatabase('create_order', 'solicitudes', { id: solicitud.id_solicitud, numero_pedido });

      return {
        success: true,
        message: 'Pedido creado exitosamente',
        data: { solicitud }
      };
    } catch (error) {
      await transaction.rollback();
      logDatabase('create_order', 'solicitudes', { error: error.message });
      throw error;
    }
  }

  // Obtener pedidos del usuario
  static async getUserOrders(usuarioId, filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        estado,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = filters;

      const offset = (page - 1) * limit;
      const whereClause = { usuario_id: usuarioId };

      if (estado) {
        whereClause.estado = estado;
      }

      const { count, rows: solicitudes } = await Solicitud.findAndCountAll({
        where: whereClause,
        include: [{
          association: 'detalles',
          include: [{
            association: 'producto',
            attributes: ['id_producto', 'nombre', 'imagen']
          }]
        }],
        order: [[sort_by, sort_order]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      logDatabase('get_user_orders', 'solicitudes', { usuarioId, count });

      return {
        success: true,
        data: {
          solicitudes,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            pages: Math.ceil(count / limit)
          }
        }
      };
    } catch (error) {
      logDatabase('get_user_orders', 'solicitudes', { error: error.message });
      throw error;
    }
  }

  // Obtener pedido por ID
  static async getOrderById(id, usuarioId = null) {
    try {
      const whereClause = { id_solicitud: id };
      
      // Si se proporciona usuarioId, verificar que el pedido pertenece al usuario
      if (usuarioId) {
        whereClause.usuario_id = usuarioId;
      }

      const solicitud = await Solicitud.findOne({
        where: whereClause,
        include: [
          {
            association: 'usuario',
            attributes: ['id_usuario', 'nombre', 'apellido', 'email']
          },
          {
            association: 'detalles',
            include: [{
              association: 'producto',
              attributes: ['id_producto', 'nombre', 'imagen', 'precio']
            }]
          }
        ]
      });

      if (!solicitud) {
        throw createError('Pedido no encontrado', 404);
      }

      logDatabase('get_order_by_id', 'solicitudes', { id });

      return {
        success: true,
        data: { solicitud }
      };
    } catch (error) {
      logDatabase('get_order_by_id', 'solicitudes', { error: error.message });
      throw error;
    }
  }

  // Obtener pedido por número de pedido
  static async getOrderByNumber(numeroPedido) {
    try {
      const solicitud = await Solicitud.findOne({
        where: { numero_pedido },
        include: [
          {
            association: 'usuario',
            attributes: ['id_usuario', 'nombre', 'apellido', 'email']
          },
          {
            association: 'detalles',
            include: [{
              association: 'producto',
              attributes: ['id_producto', 'nombre', 'imagen', 'precio']
            }]
          }
        ]
      });

      if (!solicitud) {
        throw createError('Pedido no encontrado', 404);
      }

      logDatabase('get_order_by_number', 'solicitudes', { numero_pedido: numeroPedido });

      return {
        success: true,
        data: { solicitud }
      };
    } catch (error) {
      logDatabase('get_order_by_number', 'solicitudes', { error: error.message });
      throw error;
    }
  }

  // Actualizar estado del pedido
  static async updateOrderStatus(id, newStatus, motivoRechazo = null) {
    try {
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) {
        throw createError('Pedido no encontrado', 404);
      }

      // Validar transición de estado
      const validTransitions = {
        'pendiente': ['aceptada', 'rechazada'],
        'aceptada': ['en_proceso', 'rechazada'],
        'en_proceso': ['enviada', 'rechazada'],
        'enviada': ['entregada'],
        'rechazada': [],
        'entregada': [],
        'cancelada': []
      };

      if (!validTransitions[solicitud.estado]?.includes(newStatus)) {
        throw createError(`No se puede cambiar de ${solicitud.estado} a ${newStatus}`, 400);
      }

      const updateData = { estado: newStatus };
      if (newStatus === 'rechazada' && motivoRechazo) {
        updateData.motivo_rechazo = motivoRechazo;
      }

      await solicitud.update(updateData);

      logDatabase('update_order_status', 'solicitudes', { id, newStatus });

      return {
        success: true,
        message: 'Estado del pedido actualizado exitosamente',
        data: { solicitud }
      };
    } catch (error) {
      logDatabase('update_order_status', 'solicitudes', { error: error.message });
      throw error;
    }
  }

  // Cancelar pedido
  static async cancelOrder(id, usuarioId) {
    try {
      const solicitud = await Solicitud.findOne({
        where: { 
          id_solicitud: id,
          usuario_id: usuarioId
        }
      });

      if (!solicitud) {
        throw createError('Pedido no encontrado', 404);
      }

      if (!solicitud.canBeCancelled()) {
        throw createError('Este pedido no puede ser cancelado', 400);
      }

      // Restaurar stock de productos
      const detalles = await DetalleSolicitud.findAll({
        where: { solicitud_id: id }
      });

      for (const detalle of detalles) {
        await Producto.update(
          { stock: Producto.sequelize.literal(`stock + ${detalle.cantidad}`) },
          { where: { id_producto: detalle.producto_id } }
        );
      }

      await solicitud.update({ estado: 'cancelada' });

      logDatabase('cancel_order', 'solicitudes', { id });

      return {
        success: true,
        message: 'Pedido cancelado exitosamente'
      };
    } catch (error) {
      logDatabase('cancel_order', 'solicitudes', { error: error.message });
      throw error;
    }
  }

  // Obtener todos los pedidos (admin)
  static async getAllOrders(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        estado,
        fecha_inicio,
        fecha_fin,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = filters;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (estado) {
        whereClause.estado = estado;
      }

      if (fecha_inicio || fecha_fin) {
        whereClause.fecha_solicitud = {};
        if (fecha_inicio) whereClause.fecha_solicitud[Op.gte] = fecha_inicio;
        if (fecha_fin) whereClause.fecha_solicitud[Op.lte] = fecha_fin;
      }

      const { count, rows: solicitudes } = await Solicitud.findAndCountAll({
        where: whereClause,
        include: [
          {
            association: 'usuario',
            attributes: ['id_usuario', 'nombre', 'apellido', 'email']
          },
          {
            association: 'detalles',
            include: [{
              association: 'producto',
              attributes: ['id_producto', 'nombre', 'imagen']
            }]
          }
        ],
        order: [[sort_by, sort_order]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      logDatabase('get_all_orders', 'solicitudes', { count });

      return {
        success: true,
        data: {
          solicitudes,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            pages: Math.ceil(count / limit)
          }
        }
      };
    } catch (error) {
      logDatabase('get_all_orders', 'solicitudes', { error: error.message });
      throw error;
    }
  }

  // Obtener estadísticas de pedidos
  static async getOrderStats(fechaInicio = null, fechaFin = null) {
    try {
      const whereClause = {};
      
      if (fechaInicio || fechaFin) {
        whereClause.fecha_solicitud = {};
        if (fechaInicio) whereClause.fecha_solicitud[Op.gte] = fechaInicio;
        if (fechaFin) whereClause.fecha_solicitud[Op.lte] = fechaFin;
      }

      const stats = await Solicitud.findAll({
        where: whereClause,
        attributes: [
          'estado',
          [Solicitud.sequelize.fn('COUNT', Solicitud.sequelize.col('id_solicitud')), 'count']
        ],
        group: ['estado']
      });

      const totalOrders = await Solicitud.count({ where: whereClause });
      const totalSales = await Solicitud.sum('total', { 
        where: { 
          ...whereClause,
          estado: 'entregada' 
        } 
      });

      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      logDatabase('get_order_stats', 'solicitudes', { totalOrders, totalSales });

      return {
        success: true,
        data: {
          totalOrders,
          totalSales: totalSales || 0,
          averageOrderValue,
          byStatus: stats
        }
      };
    } catch (error) {
      logDatabase('get_order_stats', 'solicitudes', { error: error.message });
      throw error;
    }
  }
}

module.exports = OrderService;


