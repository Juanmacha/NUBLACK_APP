const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('productos', {
      id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      precio_original: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo'
      },
      imagen: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      imagenes: {
        type: DataTypes.JSON,
        allowNull: true
      },
      talla: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      tallas: {
        type: DataTypes.JSON,
        allowNull: true
      },
      genero: {
        type: DataTypes.ENUM('Hombre', 'Mujer', 'Unisex'),
        defaultValue: 'Unisex'
      },
      categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'categorias',
          key: 'id_categoria'
        }
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      rating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 4.5
      },
      variantes: {
        type: DataTypes.JSON,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    // Crear índices
    await queryInterface.addIndex('productos', ['nombre']);
    await queryInterface.addIndex('productos', ['precio']);
    await queryInterface.addIndex('productos', ['estado']);
    await queryInterface.addIndex('productos', ['genero']);
    await queryInterface.addIndex('productos', ['categoria_id']);
    await queryInterface.addIndex('productos', ['rating']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('productos');
  }
};


