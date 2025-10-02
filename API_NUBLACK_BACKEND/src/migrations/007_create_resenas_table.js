const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reseñas', {
      id_resena: {
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
      calificacion: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      comentario: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      estado: {
        type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'),
        defaultValue: 'pendiente'
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
    await queryInterface.addIndex('reseñas', ['usuario_id']);
    await queryInterface.addIndex('reseñas', ['producto_id']);
    await queryInterface.addIndex('reseñas', ['calificacion']);
    await queryInterface.addIndex('reseñas', ['estado']);
    
    // Crear índice único compuesto
    await queryInterface.addIndex('reseñas', ['usuario_id', 'producto_id'], {
      unique: true,
      name: 'unique_user_product_review'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reseñas');
  }
};


