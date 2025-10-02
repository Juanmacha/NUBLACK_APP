const { Producto, Categoria, Resena } = require('../models');
const { logDatabase } = require('../config/logger');
const { createError } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

class ProductService {
  // Obtener todos los productos con filtros
  static async getProducts(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        categoria_id,
        genero,
        min_price,
        max_price,
        sort_by = 'created_at',
        sort_order = 'DESC',
        estado = 'activo'
      } = filters;

      const offset = (page - 1) * limit;
      const whereClause = { estado };

      // Aplicar filtros
      if (search) {
        whereClause[Op.or] = [
          { nombre: { [Op.like]: `%${search}%` } },
          { descripcion: { [Op.like]: `%${search}%` } }
        ];
      }

      if (categoria_id) {
        whereClause.categoria_id = categoria_id;
      }

      if (genero) {
        whereClause.genero = genero;
      }

      if (min_price || max_price) {
        whereClause.precio = {};
        if (min_price) whereClause.precio[Op.gte] = min_price;
        if (max_price) whereClause.precio[Op.lte] = max_price;
      }

      const { count, rows: productos } = await Producto.findAndCountAll({
        where: whereClause,
        include: [{
          association: 'categoria',
          attributes: ['id_categoria', 'nombre']
        }],
        order: [[sort_by, sort_order]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      logDatabase('get_products', 'productos', { filters, count });

      return {
        success: true,
        data: {
          productos,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            pages: Math.ceil(count / limit)
          }
        }
      };
    } catch (error) {
      logDatabase('get_products', 'productos', { error: error.message });
      throw error;
    }
  }

  // Obtener producto por ID
  static async getProductById(id) {
    try {
      const producto = await Producto.findByPk(id, {
        include: [
          {
            association: 'categoria',
            attributes: ['id_categoria', 'nombre', 'descripcion']
          },
          {
            association: 'reseñas',
            where: { estado: 'aprobada' },
            required: false,
            include: [{
              association: 'usuario',
              attributes: ['nombre', 'apellido']
            }],
            order: [['created_at', 'DESC']],
            limit: 10
          }
        ]
      });

      if (!producto) {
        throw createError('Producto no encontrado', 404);
      }

      logDatabase('get_product_by_id', 'productos', { id });

      return {
        success: true,
        data: { producto }
      };
    } catch (error) {
      logDatabase('get_product_by_id', 'productos', { error: error.message });
      throw error;
    }
  }

  // Crear nuevo producto
  static async createProduct(productData) {
    try {
      // Verificar que la categoría existe
      if (productData.categoria_id) {
        const categoria = await Categoria.findByPk(productData.categoria_id);
        if (!categoria) {
          throw createError('Categoría no encontrada', 400);
        }
      }

      const producto = await Producto.create(productData);

      // Cargar el producto con sus relaciones
      const productoCompleto = await Producto.findByPk(producto.id_producto, {
        include: [{
          association: 'categoria',
          attributes: ['id_categoria', 'nombre']
        }]
      });

      logDatabase('create_product', 'productos', { id: producto.id_producto });

      return {
        success: true,
        message: 'Producto creado exitosamente',
        data: { producto: productoCompleto }
      };
    } catch (error) {
      logDatabase('create_product', 'productos', { error: error.message });
      throw error;
    }
  }

  // Actualizar producto
  static async updateProduct(id, updateData) {
    try {
      const producto = await Producto.findByPk(id);
      if (!producto) {
        throw createError('Producto no encontrado', 404);
      }

      // Verificar que la categoría existe si se está actualizando
      if (updateData.categoria_id) {
        const categoria = await Categoria.findByPk(updateData.categoria_id);
        if (!categoria) {
          throw createError('Categoría no encontrada', 400);
        }
      }

      await producto.update(updateData);

      // Cargar el producto actualizado con sus relaciones
      const productoActualizado = await Producto.findByPk(id, {
        include: [{
          association: 'categoria',
          attributes: ['id_categoria', 'nombre']
        }]
      });

      logDatabase('update_product', 'productos', { id });

      return {
        success: true,
        message: 'Producto actualizado exitosamente',
        data: { producto: productoActualizado }
      };
    } catch (error) {
      logDatabase('update_product', 'productos', { error: error.message });
      throw error;
    }
  }

  // Eliminar producto
  static async deleteProduct(id) {
    try {
      const producto = await Producto.findByPk(id);
      if (!producto) {
        throw createError('Producto no encontrado', 404);
      }

      // Verificar si el producto tiene pedidos asociados
      const detallesCount = await producto.countDetalles_solicitud();
      if (detallesCount > 0) {
        // En lugar de eliminar, marcar como inactivo
        await producto.update({ estado: 'inactivo' });
        
        logDatabase('soft_delete_product', 'productos', { id });
        
        return {
          success: true,
          message: 'Producto desactivado exitosamente (tiene pedidos asociados)'
        };
      }

      await producto.destroy();

      logDatabase('delete_product', 'productos', { id });

      return {
        success: true,
        message: 'Producto eliminado exitosamente'
      };
    } catch (error) {
      logDatabase('delete_product', 'productos', { error: error.message });
      throw error;
    }
  }

  // Obtener productos destacados
  static async getFeaturedProducts(limit = 10) {
    try {
      const productos = await Producto.findAll({
        where: { estado: 'activo' },
        include: [{
          association: 'categoria',
          attributes: ['id_categoria', 'nombre']
        }],
        order: [['rating', 'DESC'], ['created_at', 'DESC']],
        limit: parseInt(limit)
      });

      logDatabase('get_featured_products', 'productos', { limit });

      return {
        success: true,
        data: { productos }
      };
    } catch (error) {
      logDatabase('get_featured_products', 'productos', { error: error.message });
      throw error;
    }
  }

  // Obtener productos más vendidos
  static async getBestSellingProducts(limit = 10) {
    try {
      const productos = await Producto.findAll({
        where: { estado: 'activo' },
        include: [
          {
            association: 'categoria',
            attributes: ['id_categoria', 'nombre']
          },
          {
            association: 'detalles_solicitud',
            required: true,
            attributes: []
          }
        ],
        attributes: {
          include: [
            [Producto.sequelize.fn('SUM', Producto.sequelize.col('detalles_solicitud.cantidad')), 'total_vendido']
          ]
        },
        group: ['Producto.id_producto'],
        order: [[Producto.sequelize.literal('total_vendido'), 'DESC']],
        limit: parseInt(limit)
      });

      logDatabase('get_best_selling_products', 'productos', { limit });

      return {
        success: true,
        data: { productos }
      };
    } catch (error) {
      logDatabase('get_best_selling_products', 'productos', { error: error.message });
      throw error;
    }
  }

  // Obtener productos con descuento
  static async getDiscountedProducts(limit = 10) {
    try {
      const productos = await Producto.findAll({
        where: {
          estado: 'activo',
          precio_original: { [Op.gt]: Producto.sequelize.col('precio') }
        },
        include: [{
          association: 'categoria',
          attributes: ['id_categoria', 'nombre']
        }],
        order: [
          [Producto.sequelize.literal('(precio_original - precio) / precio_original'), 'DESC']
        ],
        limit: parseInt(limit)
      });

      logDatabase('get_discounted_products', 'productos', { limit });

      return {
        success: true,
        data: { productos }
      };
    } catch (error) {
      logDatabase('get_discounted_products', 'productos', { error: error.message });
      throw error;
    }
  }

  // Buscar productos
  static async searchProducts(searchTerm, filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        categoria_id,
        genero,
        min_price,
        max_price
      } = filters;

      const offset = (page - 1) * limit;
      const whereClause = {
        estado: 'activo',
        [Op.or]: [
          { nombre: { [Op.like]: `%${searchTerm}%` } },
          { descripcion: { [Op.like]: `%${searchTerm}%` } }
        ]
      };

      if (categoria_id) {
        whereClause.categoria_id = categoria_id;
      }

      if (genero) {
        whereClause.genero = genero;
      }

      if (min_price || max_price) {
        whereClause.precio = {};
        if (min_price) whereClause.precio[Op.gte] = min_price;
        if (max_price) whereClause.precio[Op.lte] = max_price;
      }

      const { count, rows: productos } = await Producto.findAndCountAll({
        where: whereClause,
        include: [{
          association: 'categoria',
          attributes: ['id_categoria', 'nombre']
        }],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      logDatabase('search_products', 'productos', { searchTerm, count });

      return {
        success: true,
        data: {
          productos,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            pages: Math.ceil(count / limit)
          }
        }
      };
    } catch (error) {
      logDatabase('search_products', 'productos', { error: error.message });
      throw error;
    }
  }

  // Actualizar stock de producto
  static async updateStock(id, cantidad) {
    try {
      const producto = await Producto.findByPk(id);
      if (!producto) {
        throw createError('Producto no encontrado', 404);
      }

      const nuevoStock = producto.stock + cantidad;
      if (nuevoStock < 0) {
        throw createError('Stock insuficiente', 400);
      }

      await producto.update({ stock: nuevoStock });

      logDatabase('update_stock', 'productos', { id, cantidad, nuevoStock });

      return {
        success: true,
        message: 'Stock actualizado exitosamente',
        data: { stock: nuevoStock }
      };
    } catch (error) {
      logDatabase('update_stock', 'productos', { error: error.message });
      throw error;
    }
  }

  // Obtener estadísticas de productos
  static async getProductStats() {
    try {
      const stats = await Producto.findAll({
        attributes: [
          'estado',
          [Producto.sequelize.fn('COUNT', Producto.sequelize.col('id_producto')), 'count']
        ],
        group: ['estado']
      });

      const totalProducts = await Producto.count();
      const activeProducts = await Producto.count({ where: { estado: 'activo' } });
      const lowStockProducts = await Producto.count({
        where: {
          estado: 'activo',
          stock: { [Op.lt]: 10 }
        }
      });

      logDatabase('get_product_stats', 'productos', { totalProducts, activeProducts, lowStockProducts });

      return {
        success: true,
        data: {
          total: totalProducts,
          active: activeProducts,
          inactive: totalProducts - activeProducts,
          lowStock: lowStockProducts,
          byStatus: stats
        }
      };
    } catch (error) {
      logDatabase('get_product_stats', 'productos', { error: error.message });
      throw error;
    }
  }
}

module.exports = ProductService;


