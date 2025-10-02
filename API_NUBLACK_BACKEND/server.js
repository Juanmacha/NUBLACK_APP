const app = require('./app');
const { testConnection, syncDatabase, createSampleData } = require('./src/models');
const { verifyEmailConfig } = require('./src/config/email');
const { logger } = require('./src/config/logger');

// Configuración del servidor
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

// Función para inicializar el servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    logger.info('Verificando conexión a la base de datos...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // Sincronizar modelos con la base de datos
    logger.info('Sincronizando modelos con la base de datos...');
    const dbSynced = await syncDatabase();
    if (!dbSynced) {
      logger.error('No se pudo sincronizar la base de datos');
      process.exit(1);
    }

    // Crear datos de ejemplo en desarrollo
    if (process.env.NODE_ENV === 'development') {
      logger.info('Creando datos de ejemplo...');
      await createSampleData();
    }

    // Verificar configuración de email
    logger.info('Verificando configuración de email...');
    const emailConfigured = await verifyEmailConfig();
    if (!emailConfigured) {
      logger.warn('Configuración de email no válida - las funciones de email no funcionarán');
    }

    // Iniciar servidor
    const server = app.listen(PORT, HOST, () => {
      logger.info(`🚀 Servidor iniciado en http://${HOST}:${PORT}`);
      logger.info(`📚 Documentación disponible en http://${HOST}:${PORT}/api/info`);
      logger.info(`🏥 Health check disponible en http://${HOST}:${PORT}/api/health`);
      logger.info(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });

    // Configurar timeout del servidor
    server.timeout = 30000; // 30 segundos

    // Manejo de cierre graceful del servidor
    const gracefulShutdown = (signal) => {
      logger.info(`Recibida señal ${signal}. Cerrando servidor...`);
      
      server.close((err) => {
        if (err) {
          logger.error('Error al cerrar el servidor:', err);
          process.exit(1);
        }
        
        logger.info('Servidor cerrado correctamente');
        process.exit(0);
      });

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        logger.error('Forzando cierre del servidor');
        process.exit(1);
      }, 10000);
    };

    // Escuchar señales de cierre
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Manejo de errores del servidor
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Puerto ${PORT} ya está en uso`);
      } else {
        logger.error('Error del servidor:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    logger.error('Error al inicializar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
