const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('carrito', {
      id_carrito: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        }
      },
      producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'productos',
          key: 'id_producto'
        }
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      talla: {
        type: DataTypes.STRING(50),
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
    await queryInterface.addIndex('carrito', ['usuario_id']);
    await queryInterface.addIndex('carrito', ['producto_id']);
    
    // Crear índice único compuesto
    await queryInterface.addIndex('carrito', ['usuario_id', 'producto_id', 'talla'], {
      unique: true,
      name: 'unique_user_product_size'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('carrito');
  }
};


