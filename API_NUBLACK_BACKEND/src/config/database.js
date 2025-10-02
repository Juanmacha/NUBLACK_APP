const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la base de datos
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'NUblack',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  dialect: process.env.DB_DIALECT || 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX) || 10,
    min: parseInt(process.env.DB_POOL_MIN) || 0,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
    idle: parseInt(process.env.DB_POOL_IDLE) || 10000
  },
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true
  },
  timezone: '-05:00' // Zona horaria de Colombia
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    return false;
  }
};

// Función para sincronizar modelos
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Base de datos sincronizada correctamente.');
    return true;
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error.message);
    return false;
  }
};

// Función para cerrar la conexión
const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('✅ Conexión a la base de datos cerrada correctamente.');
    return true;
  } catch (error) {
    console.error('❌ Error al cerrar la conexión:', error.message);
    return false;
  }
};

// Función para crear datos de ejemplo
const createSampleData = async () => {
  try {
    const { Usuario, Categoria, Producto } = require('../models');
    const bcrypt = require('bcryptjs');

    // Crear categorías de ejemplo
    const categorias = await Categoria.bulkCreate([
      {
        nombre: 'Zapatos Deportivos',
        descripcion: 'Calzado deportivo de alta calidad',
        estado: 'Activo'
      },
      {
        nombre: 'Ropa Deportiva',
        descripcion: 'Ropa para actividades deportivas',
        estado: 'Activo'
      },
      {
        nombre: 'Accesorios',
        descripcion: 'Accesorios deportivos y de moda',
        estado: 'Activo'
      }
    ], { ignoreDuplicates: true });

    // Crear productos de ejemplo
    const productos = await Producto.bulkCreate([
      {
        nombre: 'Jordan Air 1 Retro',
        precio: 450000,
        precio_original: 500000,
        descripcion: 'Zapatillas clásicas de Jordan con tecnología Air',
        genero: 'Unisex',
        categoria_id: categorias[0].id_categoria,
        stock: 50,
        rating: 4.8,
        tallas: JSON.stringify(['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12']),
        imagenes: JSON.stringify(['https://ejemplo.com/jordan1.jpg']),
        estado: 'Activo'
      },
      {
        nombre: 'Nike Air Max 270',
        precio: 380000,
        precio_original: 420000,
        descripcion: 'Zapatillas Nike con tecnología Air Max',
        genero: 'Unisex',
        categoria_id: categorias[0].id_categoria,
        stock: 30,
        rating: 4.6,
        tallas: JSON.stringify(['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12']),
        imagenes: JSON.stringify(['https://ejemplo.com/airmax270.jpg']),
        estado: 'Activo'
      },
      {
        nombre: 'Adidas Ultraboost 22',
        precio: 520000,
        precio_original: 580000,
        descripcion: 'Zapatillas Adidas con tecnología Boost',
        genero: 'Unisex',
        categoria_id: categorias[0].id_categoria,
        stock: 25,
        rating: 4.9,
        tallas: JSON.stringify(['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12']),
        imagenes: JSON.stringify(['https://ejemplo.com/ultraboost22.jpg']),
        estado: 'Activo'
      }
    ], { ignoreDuplicates: true });

    console.log('✅ Datos de ejemplo creados exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error creando datos de ejemplo:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  closeConnection,
  createSampleData
};
