const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('logs_actividad', {
      id_log: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        }
      },
      accion: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      tabla_afectada: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      registro_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      datos_anteriores: {
        type: DataTypes.JSON,
        allowNull: true
      },
      datos_nuevos: {
        type: DataTypes.JSON,
        allowNull: true
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    // Crear índices
    await queryInterface.addIndex('logs_actividad', ['usuario_id']);
    await queryInterface.addIndex('logs_actividad', ['accion']);
    await queryInterface.addIndex('logs_actividad', ['tabla_afectada']);
    await queryInterface.addIndex('logs_actividad', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('logs_actividad');
  }
};


