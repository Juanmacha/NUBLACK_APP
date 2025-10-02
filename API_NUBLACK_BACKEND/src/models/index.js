const { sequelize } = require('../config/database');

// Importar todos los modelos
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Producto = require('./Producto');
const Solicitud = require('./Solicitud');
const DetalleSolicitud = require('./DetalleSolicitud');
const Carrito = require('./Carrito');
const Resena = require('./Resena');

// Definir las asociaciones entre modelos

// Usuario -> Solicitudes (1:N)
Usuario.hasMany(Solicitud, {
  foreignKey: 'usuario_id',
  as: 'solicitudes'
});
Solicitud.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

// Usuario -> Carrito (1:N)
Usuario.hasMany(Carrito, {
  foreignKey: 'usuario_id',
  as: 'carrito'
});
Carrito.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

// Usuario -> Reseñas (1:N)
Usuario.hasMany(Resena, {
  foreignKey: 'usuario_id',
  as: 'reseñas'
});
Resena.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

// Categoria -> Productos (1:N)
Categoria.hasMany(Producto, {
  foreignKey: 'categoria_id',
  as: 'productos'
});
Producto.belongsTo(Categoria, {
  foreignKey: 'categoria_id',
  as: 'categoria'
});

// Producto -> DetallesSolicitud (1:N)
Producto.hasMany(DetalleSolicitud, {
  foreignKey: 'producto_id',
  as: 'detalles_solicitud'
});
DetalleSolicitud.belongsTo(Producto, {
  foreignKey: 'producto_id',
  as: 'producto'
});

// Producto -> Carrito (1:N)
Producto.hasMany(Carrito, {
  foreignKey: 'producto_id',
  as: 'carrito'
});
Carrito.belongsTo(Producto, {
  foreignKey: 'producto_id',
  as: 'producto'
});

// Producto -> Reseñas (1:N)
Producto.hasMany(Resena, {
  foreignKey: 'producto_id',
  as: 'reseñas'
});
Resena.belongsTo(Producto, {
  foreignKey: 'producto_id',
  as: 'producto'
});

// Solicitud -> DetallesSolicitud (1:N)
Solicitud.hasMany(DetalleSolicitud, {
  foreignKey: 'solicitud_id',
  as: 'detalles'
});
DetalleSolicitud.belongsTo(Solicitud, {
  foreignKey: 'solicitud_id',
  as: 'solicitud'
});

// Función para sincronizar todos los modelos
const syncAllModels = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Todos los modelos sincronizados correctamente.');
    return true;
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error.message);
    return false;
  }
};

// Función para crear datos de ejemplo
const createSampleData = async () => {
  try {
    // Crear categorías de ejemplo
    const categorias = await Categoria.bulkCreate([
      { nombre: 'Zapatos', descripcion: 'Calzado deportivo y casual' },
      { nombre: 'Mochilas', descripcion: 'Mochilas para toda ocasión' },
      { nombre: 'Camisetas', descripcion: 'Camisetas para hombre y mujer' },
      { nombre: 'Jeans', descripcion: 'Jeans para hombre y mujer' },
      { nombre: 'Chaquetas', descripcion: 'Chaquetas para hombre y mujer' }
    ], { ignoreDuplicates: true });

    // Crear usuario administrador
    const admin = await Usuario.findOrCreate({
      where: { email: 'admin@nublack.com' },
      defaults: {
        nombre: 'Administrador',
        apellido: 'NUBLACK',
        tipo_documento: 'Cédula de Ciudadanía',
        documento: '12345678',
        telefono: '3001234567',
        email: 'admin@nublack.com',
        password_hash: 'admin123', // Se hasheará automáticamente
        rol: 'administrador',
        estado: 'activo'
      }
    });

    // Crear productos de ejemplo
    const productos = await Producto.bulkCreate([
      {
        nombre: 'Jordan Air 1',
        precio: 450000,
        precio_original: 500000,
        descripcion: 'Zapatillas deportivas de alta calidad con tecnología Air',
        genero: 'Unisex',
        categoria_id: categorias[0].id_categoria,
        stock: 50,
        rating: 4.8
      },
      {
        nombre: 'Nike Air Max 270',
        precio: 380000,
        precio_original: 420000,
        descripcion: 'Zapatillas cómodas para running con amortiguación Max Air',
        genero: 'Unisex',
        categoria_id: categorias[0].id_categoria,
        stock: 30,
        rating: 4.6
      },
      {
        nombre: 'Mochila Nike Heritage',
        precio: 120000,
        precio_original: 150000,
        descripcion: 'Mochila resistente y espaciosa para uso diario',
        genero: 'Unisex',
        categoria_id: categorias[1].id_categoria,
        stock: 25,
        rating: 4.5
      }
    ], { ignoreDuplicates: true });

    console.log('✅ Datos de ejemplo creados correctamente.');
    return true;
  } catch (error) {
    console.error('❌ Error al crear datos de ejemplo:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  Usuario,
  Categoria,
  Producto,
  Solicitud,
  DetalleSolicitud,
  Carrito,
  Resena,
  syncAllModels,
  createSampleData
};


