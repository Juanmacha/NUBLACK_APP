const { Categoria } = require('../models');
const { logDatabase } = require('../config/logger');
const { asyncHandler, createError } = require('../middlewares/errorHandler');

class CategoryController {
  // Obtener todas las categorías
  static getCategories = asyncHandler(async (req, res) => {
    try {
      const { estado = 'Activo' } = req.query;
      
      const categorias = await Categoria.findAll({
        where: estado ? { estado } : {},
        order: [['nombre', 'ASC']]
      });

      logDatabase('get_categories', 'categorias', { count: categorias.length });

      res.json({
        success: true,
        data: { categorias }
      });
    } catch (error) {
      logDatabase('get_categories', 'categorias', { error: error.message });
      throw error;
    }
  });

  // Obtener categoría por ID
  static getCategoryById = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      const categoria = await Categoria.findByPk(id, {
        include: [{
          association: 'productos',
          where: { estado: 'activo' },
          required: false,
          limit: 10,
          order: [['created_at', 'DESC']]
        }]
      });

      if (!categoria) {
        throw createError('Categoría no encontrada', 404);
      }

      logDatabase('get_category_by_id', 'categorias', { id });

      res.json({
        success: true,
        data: { categoria }
      });
    } catch (error) {
      logDatabase('get_category_by_id', 'categorias', { error: error.message });
      throw error;
    }
  });

  // Crear nueva categoría
  static createCategory = asyncHandler(async (req, res) => {
    try {
      const categoria = await Categoria.create(req.body);

      logDatabase('create_category', 'categorias', { id: categoria.id_categoria });

      res.status(201).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: { categoria }
      });
    } catch (error) {
      logDatabase('create_category', 'categorias', { error: error.message });
      throw error;
    }
  });

  // Actualizar categoría
  static updateCategory = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        throw createError('Categoría no encontrada', 404);
      }

      await categoria.update(req.body);

      logDatabase('update_category', 'categorias', { id });

      res.json({
        success: true,
        message: 'Categoría actualizada exitosamente',
        data: { categoria }
      });
    } catch (error) {
      logDatabase('update_category', 'categorias', { error: error.message });
      throw error;
    }
  });

  // Eliminar categoría
  static deleteCategory = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        throw createError('Categoría no encontrada', 404);
      }

      // Verificar si la categoría tiene productos asociados
      const productosCount = await categoria.countProductos();
      if (productosCount > 0) {
        // En lugar de eliminar, marcar como inactiva
        await categoria.update({ estado: 'Inactivo' });
        
        logDatabase('soft_delete_category', 'categorias', { id });
        
        res.json({
          success: true,
          message: 'Categoría desactivada exitosamente (tiene productos asociados)'
        });
      } else {
        await categoria.destroy();
        
        logDatabase('delete_category', 'categorias', { id });
        
        res.json({
          success: true,
          message: 'Categoría eliminada exitosamente'
        });
      }
    } catch (error) {
      logDatabase('delete_category', 'categorias', { error: error.message });
      throw error;
    }
  });

  // Obtener categorías con productos
  static getCategoriesWithProducts = asyncHandler(async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      
      const categorias = await Categoria.findAll({
        where: { estado: 'Activo' },
        include: [{
          association: 'productos',
          where: { estado: 'activo' },
          required: false,
          limit: parseInt(limit),
          order: [['created_at', 'DESC']]
        }],
        order: [['nombre', 'ASC']]
      });

      logDatabase('get_categories_with_products', 'categorias', { count: categorias.length });

      res.json({
        success: true,
        data: { categorias }
      });
    } catch (error) {
      logDatabase('get_categories_with_products', 'categorias', { error: error.message });
      throw error;
    }
  });

  // Obtener estadísticas de categorías
  static getCategoryStats = asyncHandler(async (req, res) => {
    try {
      const stats = await Categoria.findAll({
        attributes: [
          'estado',
          [Categoria.sequelize.fn('COUNT', Categoria.sequelize.col('id_categoria')), 'count']
        ],
        group: ['estado']
      });

      const totalCategories = await Categoria.count();
      const activeCategories = await Categoria.count({ where: { estado: 'Activo' } });

      // Obtener categorías con más productos
      const topCategories = await Categoria.findAll({
        where: { estado: 'Activo' },
        include: [{
          association: 'productos',
          where: { estado: 'activo' },
          required: false,
          attributes: []
        }],
        attributes: [
          'id_categoria',
          'nombre',
          [Categoria.sequelize.fn('COUNT', Categoria.sequelize.col('productos.id_producto')), 'product_count']
        ],
        group: ['Categoria.id_categoria', 'Categoria.nombre'],
        order: [[Categoria.sequelize.literal('product_count'), 'DESC']],
        limit: 5
      });

      logDatabase('get_category_stats', 'categorias', { totalCategories, activeCategories });

      res.json({
        success: true,
        data: {
          total: totalCategories,
          active: activeCategories,
          inactive: totalCategories - activeCategories,
          byStatus: stats,
          topCategories
        }
      });
    } catch (error) {
      logDatabase('get_category_stats', 'categorias', { error: error.message });
      throw error;
    }
  });
}

module.exports = CategoryController;


