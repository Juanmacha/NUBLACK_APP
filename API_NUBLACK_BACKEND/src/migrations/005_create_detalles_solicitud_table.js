const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('detalles_solicitud', {
      id_detalle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      solicitud_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'solicitudes',
          key: 'id_solicitud'
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
      nombre_producto: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      descripcion_producto: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      imagen_producto: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      talla: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    // Crear índices
    await queryInterface.addIndex('detalles_solicitud', ['solicitud_id']);
    await queryInterface.addIndex('detalles_solicitud', ['producto_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('detalles_solicitud');
  }
};


