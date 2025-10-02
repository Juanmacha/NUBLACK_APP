const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Usuario } = require('../models');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../config/email');
const { logAuth } = require('../config/logger');
const { createError } = require('../middlewares/errorHandler');

class AuthService {
  // Registrar nuevo usuario
  static async register(userData) {
    try {
      // Verificar si el email ya existe
      const existingUser = await Usuario.findByEmail(userData.email);
      if (existingUser) {
        throw createError('El email ya está registrado', 409);
      }

      // Verificar si el documento ya existe
      const existingDocument = await Usuario.findByDocument(userData.documento);
      if (existingDocument) {
        throw createError('El documento ya está registrado', 409);
      }

      // Crear usuario
      const usuario = await Usuario.create({
        nombre: userData.nombre,
        apellido: userData.apellido,
        tipo_documento: userData.tipo_documento,
        documento: userData.documento,
        telefono: userData.telefono,
        email: userData.email,
        password_hash: userData.password, // Se hasheará automáticamente
        rol: userData.rol || 'cliente',
        estado: 'activo'
      });

      // Generar tokens
      const { accessToken, refreshToken } = this.generateTokens(usuario);

      // Enviar email de bienvenida
      try {
        await sendWelcomeEmail(usuario.email, `${usuario.nombre} ${usuario.apellido}`);
      } catch (emailError) {
        console.error('Error enviando email de bienvenida:', emailError);
        // No fallar el registro por error de email
      }

      logAuth('user_registration', usuario.id_usuario, true);

      return {
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          usuario: usuario.toJSON(),
          accessToken,
          refreshToken
        }
      };
    } catch (error) {
      logAuth('user_registration', null, false, { error: error.message });
      throw error;
    }
  }

  // Iniciar sesión
  static async login(email, password) {
    try {
      // Buscar usuario por email
      const usuario = await Usuario.findByEmail(email);
      if (!usuario) {
        throw createError('Credenciales inválidas', 401);
      }

      // Verificar estado del usuario
      if (usuario.estado !== 'activo') {
        throw createError('Cuenta inactiva', 401);
      }

      // Verificar contraseña
      const isValidPassword = await usuario.validarPassword(password);
      if (!isValidPassword) {
        throw createError('Credenciales inválidas', 401);
      }

      // Generar tokens
      const { accessToken, refreshToken } = this.generateTokens(usuario);

      // Actualizar último login
      await usuario.update({ updated_at: new Date() });

      logAuth('user_login', usuario.id_usuario, true);

      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          usuario: usuario.toJSON(),
          accessToken,
          refreshToken
        }
      };
    } catch (error) {
      logAuth('user_login', null, false, { error: error.message });
      throw error;
    }
  }

  // Generar tokens JWT
  static generateTokens(usuario) {
    const payload = {
      id: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    });

    return { accessToken, refreshToken };
  }

  // Refrescar token
  static async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      const usuario = await Usuario.findByPk(decoded.id, {
        attributes: { exclude: ['password_hash', 'password_salt'] }
      });

      if (!usuario || usuario.estado !== 'activo') {
        throw createError('Token de actualización inválido', 401);
      }

      const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(usuario);

      return {
        success: true,
        message: 'Token actualizado exitosamente',
        data: {
          accessToken,
          refreshToken: newRefreshToken
        }
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw createError('Token de actualización inválido', 401);
      }
      throw error;
    }
  }

  // Solicitar recuperación de contraseña
  static async requestPasswordReset(email) {
    try {
      const usuario = await Usuario.findByEmail(email);
      if (!usuario) {
        // No revelar si el email existe o no por seguridad
        return {
          success: true,
          message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
        };
      }

      // Generar token de recuperación
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

      // Guardar token en la base de datos
      await usuario.update({
        reset_password_token: resetToken,
        reset_password_expires: resetExpires
      });

      // Enviar email de recuperación
      try {
        await sendPasswordResetEmail(
          usuario.email,
          resetToken,
          `${usuario.nombre} ${usuario.apellido}`
        );
      } catch (emailError) {
        console.error('Error enviando email de recuperación:', emailError);
        throw createError('Error enviando email de recuperación', 500);
      }

      logAuth('password_reset_request', usuario.id_usuario, true);

      return {
        success: true,
        message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
      };
    } catch (error) {
      logAuth('password_reset_request', null, false, { error: error.message });
      throw error;
    }
  }

  // Restablecer contraseña
  static async resetPassword(token, newPassword) {
    try {
      const usuario = await Usuario.findOne({
        where: {
          reset_password_token: token,
          reset_password_expires: {
            [require('sequelize').Op.gt]: new Date()
          }
        }
      });

      if (!usuario) {
        throw createError('Token de recuperación inválido o expirado', 400);
      }

      // Actualizar contraseña
      await usuario.update({
        password_hash: newPassword, // Se hasheará automáticamente
        reset_password_token: null,
        reset_password_expires: null
      });

      logAuth('password_reset', usuario.id_usuario, true);

      return {
        success: true,
        message: 'Contraseña restablecida exitosamente'
      };
    } catch (error) {
      logAuth('password_reset', null, false, { error: error.message });
      throw error;
    }
  }

  // Cambiar contraseña (usuario autenticado)
  static async changePassword(usuarioId, currentPassword, newPassword) {
    try {
      const usuario = await Usuario.findByPk(usuarioId);
      if (!usuario) {
        throw createError('Usuario no encontrado', 404);
      }

      // Verificar contraseña actual
      const isValidPassword = await usuario.validarPassword(currentPassword);
      if (!isValidPassword) {
        throw createError('Contraseña actual incorrecta', 400);
      }

      // Actualizar contraseña
      await usuario.update({
        password_hash: newPassword // Se hasheará automáticamente
      });

      logAuth('password_change', usuario.id_usuario, true);

      return {
        success: true,
        message: 'Contraseña cambiada exitosamente'
      };
    } catch (error) {
      logAuth('password_change', usuarioId, false, { error: error.message });
      throw error;
    }
  }

  // Verificar email
  static async verifyEmail(token) {
    try {
      const usuario = await Usuario.findOne({
        where: {
          email_verification_token: token
        }
      });

      if (!usuario) {
        throw createError('Token de verificación inválido', 400);
      }

      await usuario.update({
        email_verified: true,
        email_verification_token: null
      });

      logAuth('email_verification', usuario.id_usuario, true);

      return {
        success: true,
        message: 'Email verificado exitosamente'
      };
    } catch (error) {
      logAuth('email_verification', null, false, { error: error.message });
      throw error;
    }
  }

  // Obtener perfil del usuario
  static async getProfile(usuarioId) {
    try {
      const usuario = await Usuario.findByPk(usuarioId, {
        attributes: { exclude: ['password_hash', 'password_salt'] }
      });

      if (!usuario) {
        throw createError('Usuario no encontrado', 404);
      }

      return {
        success: true,
        data: {
          usuario: usuario.toJSON()
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar perfil del usuario
  static async updateProfile(usuarioId, updateData) {
    try {
      const usuario = await Usuario.findByPk(usuarioId);
      if (!usuario) {
        throw createError('Usuario no encontrado', 404);
      }

      // Campos permitidos para actualización
      const allowedFields = ['nombre', 'apellido', 'telefono'];
      const updateFields = {};

      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          updateFields[field] = updateData[field];
        }
      }

      await usuario.update(updateFields);

      logAuth('profile_update', usuario.id_usuario, true);

      return {
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: {
          usuario: usuario.toJSON()
        }
      };
    } catch (error) {
      logAuth('profile_update', usuarioId, false, { error: error.message });
      throw error;
    }
  }
}

module.exports = AuthService;


