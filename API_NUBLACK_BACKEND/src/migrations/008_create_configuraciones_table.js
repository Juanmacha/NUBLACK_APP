const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('configuraciones', {
      id_configuracion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      clave: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      valor: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tipo: {
        type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
        defaultValue: 'string'
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

    // Crear índice
    await queryInterface.addIndex('configuraciones', ['clave']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('configuraciones');
  }
};


