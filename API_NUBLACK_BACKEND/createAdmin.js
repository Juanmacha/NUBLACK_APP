const { Usuario } = require('./src/models');
const { testConnection, syncDatabase } = require('./src/config/database');
const { logger } = require('./src/config/logger');
require('dotenv').config();

// Función para crear usuario administrador
const createAdmin = async () => {
  try {
    console.log('🔧 Iniciando creación de usuario administrador...');

    // Verificar conexión a la base de datos
    console.log('📡 Verificando conexión a la base de datos...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // Sincronizar modelos
    console.log('🔄 Sincronizando modelos...');
    await syncDatabase();

    // Datos del administrador
    const adminData = {
      nombre: 'Administrador',
      apellido: 'NUBLACK',
      tipo_documento: 'Cédula de Ciudadanía',
      documento: '12345678',
      telefono: '3001234567',
      email: 'admin@nublack.com',
      password_hash: 'admin123', // Se hasheará automáticamente
      rol: 'administrador',
      estado: 'activo',
      email_verified: true
    };

    // Verificar si ya existe un administrador
    const existingAdmin = await Usuario.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email: adminData.email },
          { documento: adminData.documento }
        ]
      }
    });

    if (existingAdmin) {
      console.log('⚠️  Ya existe un usuario con este email o documento');
      console.log('📧 Email:', existingAdmin.email);
      console.log('🆔 Documento:', existingAdmin.documento);
      console.log('👤 Rol:', existingAdmin.rol);
      
      // Preguntar si desea actualizar
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('¿Desea actualizar la contraseña del administrador existente? (y/N): ', async (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          await existingAdmin.update({
            password_hash: adminData.password_hash,
            rol: 'administrador',
            estado: 'activo'
          });
          console.log('✅ Usuario administrador actualizado exitosamente');
          console.log('📧 Email:', adminData.email);
          console.log('🔑 Contraseña:', adminData.password_hash);
        } else {
          console.log('ℹ️  Operación cancelada');
        }
        rl.close();
        process.exit(0);
      });
    } else {
      // Crear nuevo administrador
      const admin = await Usuario.create(adminData);
      
      console.log('✅ Usuario administrador creado exitosamente');
      console.log('📧 Email:', admin.email);
      console.log('🔑 Contraseña:', adminData.password_hash);
      console.log('👤 Rol:', admin.rol);
      console.log('🆔 ID:', admin.id_usuario);
      
      logger.info('Admin user created', { 
        id: admin.id_usuario, 
        email: admin.email 
      });
    }

  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error.message);
    logger.error('Error creating admin user', { error: error.message });
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  createAdmin().then(() => {
    console.log('🎉 Proceso completado');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
}

module.exports = createAdmin;
