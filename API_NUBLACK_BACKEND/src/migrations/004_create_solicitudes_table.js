const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('solicitudes', {
      id_solicitud: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      numero_pedido: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        }
      },
      fecha_solicitud: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      estado: {
        type: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada', 'en_proceso', 'enviada', 'entregada', 'cancelada'),
        defaultValue: 'pendiente'
      },
      motivo_rechazo: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      nombre_cliente: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      documento_identificacion: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      telefono_contacto: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      correo_electronico: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      direccion_envio: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      referencia_direccion: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      indicaciones_adicionales: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      horario_preferido: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      metodo_pago: {
        type: DataTypes.ENUM('Contra Entrega', 'Tarjeta', 'Transferencia', 'PSE'),
        defaultValue: 'Contra Entrega'
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      tiempo_estimado_entrega: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      prioridad: {
        type: DataTypes.ENUM('baja', 'normal', 'alta', 'urgente'),
        defaultValue: 'normal'
      },
      notas_internas: {
        type: DataTypes.TEXT,
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
    await queryInterface.addIndex('solicitudes', ['numero_pedido']);
    await queryInterface.addIndex('solicitudes', ['usuario_id']);
    await queryInterface.addIndex('solicitudes', ['estado']);
    await queryInterface.addIndex('solicitudes', ['fecha_solicitud']);
    await queryInterface.addIndex('solicitudes', ['metodo_pago']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('solicitudes');
  }
};


