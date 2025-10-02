const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insertar categorías de ejemplo
    await queryInterface.bulkInsert('categorias', [
      {
        nombre: 'Zapatos',
        descripcion: 'Calzado deportivo y casual',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Mochilas',
        descripcion: 'Mochilas para toda ocasión',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Camisetas',
        descripcion: 'Camisetas para hombre y mujer',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Jeans',
        descripcion: 'Jeans para hombre y mujer',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Chaquetas',
        descripcion: 'Chaquetas para hombre y mujer',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Sudaderas',
        descripcion: 'Sudaderas para hombre y mujer',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Shorts',
        descripcion: 'Shorts para hombre y mujer',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Faldas',
        descripcion: 'Faldas para mujer',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Leggis',
        descripcion: 'Leggis para mujer',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Ropa deportiva',
        descripcion: 'Ropa para hacer deporte',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insertar usuario administrador
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Administrador',
        apellido: 'NUBLACK',
        tipo_documento: 'Cédula de Ciudadanía',
        documento: '12345678',
        telefono: '3001234567',
        email: 'admin@nublack.com',
        password_hash: hashedPassword,
        password_salt: salt,
        rol: 'administrador',
        estado: 'activo',
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insertar configuraciones del sistema
    await queryInterface.bulkInsert('configuraciones', [
      {
        clave: 'tienda_nombre',
        valor: 'NUblack',
        descripcion: 'Nombre de la tienda',
        tipo: 'string',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        clave: 'tienda_descripcion',
        valor: 'Tienda de ropa y calzado deportivo',
        descripcion: 'Descripción de la tienda',
        tipo: 'string',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        clave: 'tienda_telefono',
        valor: '3001234567',
        descripcion: 'Teléfono de contacto de la tienda',
        tipo: 'string',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        clave: 'tienda_email',
        valor: 'contacto@nublack.com',
        descripcion: 'Email de contacto de la tienda',
        tipo: 'string',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        clave: 'tienda_direccion',
        valor: 'Calle 123 #45-67, Bogotá',
        descripcion: 'Dirección de la tienda',
        tipo: 'string',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        clave: 'envio_gratis_desde',
        valor: '200000',
        descripcion: 'Monto mínimo para envío gratis',
        tipo: 'number',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        clave: 'costo_envio',
        valor: '15000',
        descripcion: 'Costo de envío estándar',
        tipo: 'number',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        clave: 'moneda',
        valor: 'COP',
        descripcion: 'Moneda de la tienda',
        tipo: 'string',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        clave: 'impuestos_habilitados',
        valor: 'true',
        descripcion: 'Si los impuestos están habilitados',
        tipo: 'boolean',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        clave: 'reservas_habilitadas',
        valor: 'true',
        descripcion: 'Si las reservas están habilitadas',
        tipo: 'boolean',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar datos de ejemplo
    await queryInterface.bulkDelete('configuraciones', null, {});
    await queryInterface.bulkDelete('usuarios', { email: 'admin@nublack.com' }, {});
    await queryInterface.bulkDelete('categorias', null, {});
  }
};


