const { testConnection, syncDatabase, createSampleData } = require('./src/config/database');
const { logger } = require('./src/config/logger');
require('dotenv').config();

// Función para reparar/actualizar la base de datos
const fixDatabase = async () => {
  try {
    console.log('🔧 Iniciando reparación de base de datos...');

    // Verificar conexión
    console.log('📡 Verificando conexión a la base de datos...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // Sincronizar modelos (force: true para recrear tablas)
    console.log('🔄 Sincronizando modelos con la base de datos...');
    const forceSync = process.argv.includes('--force');
    
    if (forceSync) {
      console.log('⚠️  Modo FORCE activado - se recrearán todas las tablas');
      console.log('⚠️  ¡TODOS LOS DATOS EXISTENTES SE PERDERÁN!');
      
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('¿Está seguro de que desea continuar? Escriba "CONFIRMAR" para proceder: ', async (answer) => {
        if (answer === 'CONFIRMAR') {
          await syncDatabase(true);
          console.log('✅ Base de datos recreada exitosamente');
          
          // Crear datos de ejemplo
          console.log('📦 Creando datos de ejemplo...');
          await createSampleData();
          console.log('✅ Datos de ejemplo creados');
        } else {
          console.log('ℹ️  Operación cancelada');
        }
        rl.close();
        process.exit(0);
      });
    } else {
      await syncDatabase();
      console.log('✅ Base de datos sincronizada exitosamente');
    }

    // Verificar integridad de datos
    console.log('🔍 Verificando integridad de datos...');
    const { Usuario, Categoria, Producto } = require('./src/models');
    
    const userCount = await Usuario.count();
    const categoryCount = await Categoria.count();
    const productCount = await Producto.count();
    
    console.log('📊 Estadísticas de la base de datos:');
    console.log(`👥 Usuarios: ${userCount}`);
    console.log(`📂 Categorías: ${categoryCount}`);
    console.log(`🛍️  Productos: ${productCount}`);

    // Crear datos de ejemplo si no existen
    if (userCount === 0 || categoryCount === 0) {
      console.log('📦 Creando datos de ejemplo...');
      await createSampleData();
      console.log('✅ Datos de ejemplo creados');
    }

    // Verificar índices
    console.log('🔍 Verificando índices de la base de datos...');
    const { sequelize } = require('./src/config/database');
    
    try {
      // Verificar algunos índices importantes
      const indexes = await sequelize.query(`
        SHOW INDEX FROM usuarios WHERE Key_name = 'idx_email';
      `);
      
      if (indexes[0].length === 0) {
        console.log('⚠️  Algunos índices pueden no estar creados correctamente');
      } else {
        console.log('✅ Índices verificados correctamente');
      }
    } catch (indexError) {
      console.log('⚠️  No se pudo verificar índices:', indexError.message);
    }

    console.log('🎉 Reparación de base de datos completada exitosamente');
    logger.info('Database repair completed successfully');

  } catch (error) {
    console.error('❌ Error reparando base de datos:', error.message);
    logger.error('Error repairing database', { error: error.message });
    process.exit(1);
  }
};

// Función para mostrar ayuda
const showHelp = () => {
  console.log(`
🔧 Herramienta de Reparación de Base de Datos - NUblack

Uso:
  node fixDatabase.js           - Sincronizar base de datos (modo seguro)
  node fixDatabase.js --force  - Recrear base de datos (¡CUIDADO! Borra todos los datos)

Opciones:
  --help, -h                   - Mostrar esta ayuda
  --force                      - Forzar recreación de tablas (peligroso)

Ejemplos:
  node fixDatabase.js                    # Sincronización segura
  node fixDatabase.js --force           # Recreación completa
  `);
};

// Ejecutar si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  fixDatabase().then(() => {
    console.log('🎉 Proceso completado');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
}

module.exports = fixDatabase;
