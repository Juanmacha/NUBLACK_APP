const { Usuario } = require('../models');
const { logDatabase } = require('../config/logger');
const { asyncHandler, createError } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

class UserController {
  // Obtener todos los usuarios (admin)
  static getUsers = asyncHandler(async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        rol,
        estado,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Aplicar filtros
      if (search) {
        whereClause[Op.or] = [
          { nombre: { [Op.like]: `%${search}%` } },
          { apellido: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { documento: { [Op.like]: `%${search}%` } }
        ];
      }

      if (rol) {
        whereClause.rol = rol;
      }

      if (estado) {
        whereClause.estado = estado;
      }

      const { count, rows: usuarios } = await Usuario.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password_hash', 'password_salt'] },
        order: [[sort_by, sort_order]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      logDatabase('get_users', 'usuarios', { count });

      res.json({
        success: true,
        data: {
          usuarios,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      logDatabase('get_users', 'usuarios', { error: error.message });
      throw error;
    }
  });

  // Obtener usuario por ID
  static getUserById = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      const usuario = await Usuario.findByPk(id, {
        attributes: { exclude: ['password_hash', 'password_salt'] }
      });

      if (!usuario) {
        throw createError('Usuario no encontrado', 404);
      }

      logDatabase('get_user_by_id', 'usuarios', { id });

      res.json({
        success: true,
        data: { usuario }
      });
    } catch (error) {
      logDatabase('get_user_by_id', 'usuarios', { error: error.message });
      throw error;
    }
  });

  // Crear nuevo usuario (admin)
  static createUser = asyncHandler(async (req, res) => {
    try {
      // Verificar si el email ya existe
      const existingEmail = await Usuario.findByEmail(req.body.email);
      if (existingEmail) {
        throw createError('El email ya está registrado', 409);
      }

      // Verificar si el documento ya existe
      const existingDocument = await Usuario.findByDocument(req.body.documento);
      if (existingDocument) {
        throw createError('El documento ya está registrado', 409);
      }

      const usuario = await Usuario.create(req.body);

      logDatabase('create_user', 'usuarios', { id: usuario.id_usuario });

      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: { usuario: usuario.toJSON() }
      });
    } catch (error) {
      logDatabase('create_user', 'usuarios', { error: error.message });
      throw error;
    }
  });

  // Actualizar usuario
  static updateUser = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        throw createError('Usuario no encontrado', 404);
      }

      // Verificar email único si se está actualizando
      if (req.body.email && req.body.email !== usuario.email) {
        const existingEmail = await Usuario.findByEmail(req.body.email);
        if (existingEmail) {
          throw createError('El email ya está registrado', 409);
        }
      }

      // Verificar documento único si se está actualizando
      if (req.body.documento && req.body.documento !== usuario.documento) {
        const existingDocument = await Usuario.findByDocument(req.body.documento);
        if (existingDocument) {
          throw createError('El documento ya está registrado', 409);
        }
      }

      await usuario.update(req.body);

      logDatabase('update_user', 'usuarios', { id });

      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: { usuario: usuario.toJSON() }
      });
    } catch (error) {
      logDatabase('update_user', 'usuarios', { error: error.message });
      throw error;
    }
  });

  // Eliminar usuario
  static deleteUser = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        throw createError('Usuario no encontrado', 404);
      }

      // Verificar si el usuario tiene pedidos asociados
      const pedidosCount = await usuario.countSolicitudes();
      if (pedidosCount > 0) {
        // En lugar de eliminar, marcar como inactivo
        await usuario.update({ estado: 'inactivo' });
        
        logDatabase('soft_delete_user', 'usuarios', { id });
        
        res.json({
          success: true,
          message: 'Usuario desactivado exitosamente (tiene pedidos asociados)'
        });
      } else {
        await usuario.destroy();
        
        logDatabase('delete_user', 'usuarios', { id });
        
        res.json({
          success: true,
          message: 'Usuario eliminado exitosamente'
        });
      }
    } catch (error) {
      logDatabase('delete_user', 'usuarios', { error: error.message });
      throw error;
    }
  });

  // Cambiar estado del usuario
  static changeUserStatus = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        throw createError('Usuario no encontrado', 404);
      }

      await usuario.update({ estado });

      logDatabase('change_user_status', 'usuarios', { id, estado });

      res.json({
        success: true,
        message: `Estado del usuario actualizado a ${estado}`,
        data: { usuario: usuario.toJSON() }
      });
    } catch (error) {
      logDatabase('change_user_status', 'usuarios', { error: error.message });
      throw error;
    }
  });

  // Obtener estadísticas de usuarios
  static getUserStats = asyncHandler(async (req, res) => {
    try {
      const stats = await Usuario.findAll({
        attributes: [
          'estado',
          [Usuario.sequelize.fn('COUNT', Usuario.sequelize.col('id_usuario')), 'count']
        ],
        group: ['estado']
      });

      const rolStats = await Usuario.findAll({
        attributes: [
          'rol',
          [Usuario.sequelize.fn('COUNT', Usuario.sequelize.col('id_usuario')), 'count']
        ],
        group: ['rol']
      });

      const totalUsers = await Usuario.count();
      const activeUsers = await Usuario.count({ where: { estado: 'activo' } });

      // Usuarios registrados en los últimos 30 días
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentUsers = await Usuario.count({
        where: {
          created_at: {
            [Op.gte]: thirtyDaysAgo
          }
        }
      });

      logDatabase('get_user_stats', 'usuarios', { totalUsers, activeUsers });

      res.json({
        success: true,
        data: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
          recent: recentUsers,
          byStatus: stats,
          byRole: rolStats
        }
      });
    } catch (error) {
      logDatabase('get_user_stats', 'usuarios', { error: error.message });
      throw error;
    }
  });

  // Buscar usuarios
  static searchUsers = asyncHandler(async (req, res) => {
    try {
      const { q, limit = 10 } = req.query;
      
      if (!q || q.length < 2) {
        throw createError('Término de búsqueda debe tener al menos 2 caracteres', 400);
      }

      const usuarios = await Usuario.findAll({
        where: {
          [Op.or]: [
            { nombre: { [Op.like]: `%${q}%` } },
            { apellido: { [Op.like]: `%${q}%` } },
            { email: { [Op.like]: `%${q}%` } },
            { documento: { [Op.like]: `%${q}%` } }
          ]
        },
        attributes: { exclude: ['password_hash', 'password_salt'] },
        limit: parseInt(limit),
        order: [['nombre', 'ASC']]
      });

      logDatabase('search_users', 'usuarios', { searchTerm: q, count: usuarios.length });

      res.json({
        success: true,
        data: { usuarios }
      });
    } catch (error) {
      logDatabase('search_users', 'usuarios', { error: error.message });
      throw error;
    }
  });
}

module.exports = UserController;


