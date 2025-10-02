const AuthService = require('../services/authService');
const { asyncHandler } = require('../middlewares/errorHandler');

class AuthController {
  // Registrar nuevo usuario
  static register = asyncHandler(async (req, res) => {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  });

  // Iniciar sesión
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  });

  // Refrescar token
  static refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshToken(refreshToken);
    res.json(result);
  });

  // Solicitar recuperación de contraseña
  static requestPasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await AuthService.requestPasswordReset(email);
    res.json(result);
  });

  // Restablecer contraseña
  static resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const result = await AuthService.resetPassword(token, password);
    res.json(result);
  });

  // Cambiar contraseña (usuario autenticado)
  static changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await AuthService.changePassword(
      req.user.id_usuario,
      currentPassword,
      newPassword
    );
    res.json(result);
  });

  // Verificar email
  static verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const result = await AuthService.verifyEmail(token);
    res.json(result);
  });

  // Obtener perfil del usuario
  static getProfile = asyncHandler(async (req, res) => {
    const result = await AuthService.getProfile(req.user.id_usuario);
    res.json(result);
  });

  // Actualizar perfil del usuario
  static updateProfile = asyncHandler(async (req, res) => {
    const result = await AuthService.updateProfile(req.user.id_usuario, req.body);
    res.json(result);
  });

  // Cerrar sesión (opcional - para invalidar tokens)
  static logout = asyncHandler(async (req, res) => {
    // En una implementación más avanzada, podrías invalidar el token
    // agregándolo a una lista negra o actualizando la base de datos
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  });
}

module.exports = AuthController;


