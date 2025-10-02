const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');
const { logger } = require('../config/logger');

// Función para ejecutar migraciones
const runMigrations = async () => {
  try {
    console.log('🔄 Iniciando migraciones de base de datos...');
    logger.info('Starting database migrations');

    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Leer archivos de migración
    const migrationsDir = __dirname;
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js') && file !== 'runMigrations.js')
      .sort();

    console.log(`📁 Encontradas ${migrationFiles.length} migraciones`);

    // Crear tabla de migraciones si no existe
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Obtener migraciones ya ejecutadas
    const [executedMigrations] = await sequelize.query(
      'SELECT filename FROM migrations ORDER BY id'
    );
    const executedFilenames = executedMigrations.map(m => m.filename);

    // Ejecutar migraciones pendientes
    for (const filename of migrationFiles) {
      if (!executedFilenames.includes(filename)) {
        console.log(`🔄 Ejecutando migración: ${filename}`);
        
        const migration = require(path.join(migrationsDir, filename));
        
        try {
          await migration.up(sequelize.getQueryInterface(), sequelize.constructor);
          
          // Registrar migración como ejecutada
          await sequelize.query(
            'INSERT INTO migrations (filename) VALUES (?)',
            { replacements: [filename] }
          );
          
          console.log(`✅ Migración ${filename} ejecutada exitosamente`);
          logger.info(`Migration ${filename} executed successfully`);
          
        } catch (error) {
          console.error(`❌ Error ejecutando migración ${filename}:`, error.message);
          logger.error(`Error executing migration ${filename}`, { error: error.message });
          
          // Intentar hacer rollback
          try {
            await migration.down(sequelize.getQueryInterface(), sequelize.constructor);
            console.log(`🔄 Rollback de ${filename} completado`);
          } catch (rollbackError) {
            console.error(`❌ Error en rollback de ${filename}:`, rollbackError.message);
          }
          
          throw error;
        }
      } else {
        console.log(`⏭️  Migración ${filename} ya ejecutada`);
      }
    }

    console.log('🎉 Todas las migraciones completadas exitosamente');
    logger.info('All migrations completed successfully');

  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error.message);
    logger.error('Error running migrations', { error: error.message });
    process.exit(1);
  }
};

// Función para revertir migraciones
const rollbackMigrations = async (steps = 1) => {
  try {
    console.log(`🔄 Revirtiendo ${steps} migración(es)...`);
    logger.info(`Rolling back ${steps} migration(s)`);

    // Obtener migraciones ejecutadas
    const [executedMigrations] = await sequelize.query(
      'SELECT filename FROM migrations ORDER BY id DESC LIMIT ?',
      { replacements: [steps] }
    );

    if (executedMigrations.length === 0) {
      console.log('ℹ️  No hay migraciones para revertir');
      return;
    }

    // Revertir migraciones
    for (const migration of executedMigrations) {
      console.log(`🔄 Revirtiendo migración: ${migration.filename}`);
      
      const migrationFile = require(path.join(__dirname, migration.filename));
      
      try {
        await migrationFile.down(sequelize.getQueryInterface(), sequelize.constructor);
        
        // Eliminar registro de migración
        await sequelize.query(
          'DELETE FROM migrations WHERE filename = ?',
          { replacements: [migration.filename] }
        );
        
        console.log(`✅ Migración ${migration.filename} revertida exitosamente`);
        logger.info(`Migration ${migration.filename} rolled back successfully`);
        
      } catch (error) {
        console.error(`❌ Error revirtiendo migración ${migration.filename}:`, error.message);
        logger.error(`Error rolling back migration ${migration.filename}`, { error: error.message });
        throw error;
      }
    }

    console.log('🎉 Migraciones revertidas exitosamente');
    logger.info('Migrations rolled back successfully');

  } catch (error) {
    console.error('❌ Error revirtiendo migraciones:', error.message);
    logger.error('Error rolling back migrations', { error: error.message });
    process.exit(1);
  }
};

// Función para mostrar estado de migraciones
const showMigrationStatus = async () => {
  try {
    console.log('📊 Estado de migraciones:');
    
    const [executedMigrations] = await sequelize.query(
      'SELECT filename, executed_at FROM migrations ORDER BY id'
    );
    
    const allMigrations = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.js') && file !== 'runMigrations.js')
      .sort();
    
    console.log(`Total de migraciones: ${allMigrations.length}`);
    console.log(`Ejecutadas: ${executedMigrations.length}`);
    console.log(`Pendientes: ${allMigrations.length - executedMigrations.length}`);
    
    console.log('\n📋 Lista de migraciones:');
    for (const filename of allMigrations) {
      const executed = executedMigrations.find(m => m.filename === filename);
      const status = executed ? '✅' : '⏳';
      const date = executed ? executed.executed_at : 'Pendiente';
      console.log(`${status} ${filename} - ${date}`);
    }

  } catch (error) {
    console.error('❌ Error obteniendo estado de migraciones:', error.message);
    process.exit(1);
  }
};

// Función principal
const main = async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'up':
      await runMigrations();
      break;
    case 'down':
      const steps = parseInt(args[1]) || 1;
      await rollbackMigrations(steps);
      break;
    case 'status':
      await showMigrationStatus();
      break;
    case 'reset':
      console.log('⚠️  Revirtiendo todas las migraciones...');
      const allMigrations = fs.readdirSync(__dirname)
        .filter(file => file.endsWith('.js') && file !== 'runMigrations.js')
        .length;
      await rollbackMigrations(allMigrations);
      break;
    default:
      console.log(`
🔄 Gestor de Migraciones - NUblack

Uso:
  node runMigrations.js up      - Ejecutar migraciones pendientes
  node runMigrations.js down    - Revertir última migración
  node runMigrations.js down N  - Revertir N migraciones
  node runMigrations.js status  - Mostrar estado de migraciones
  node runMigrations.js reset   - Revertir todas las migraciones

Ejemplos:
  node runMigrations.js up           # Ejecutar migraciones
  node runMigrations.js down         # Revertir 1 migración
  node runMigrations.js down 3       # Revertir 3 migraciones
  node runMigrations.js status       # Ver estado
      `);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  main().then(() => {
    console.log('🎉 Proceso completado');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
}

module.exports = {
  runMigrations,
  rollbackMigrations,
  showMigrationStatus
};


