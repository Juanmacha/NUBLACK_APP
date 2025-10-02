const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Solicitud = sequelize.define('Solicitud', {
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
  
  // Información Personal
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
  
  // Información de Entrega
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
  
  // Preferencias y Pago
  metodo_pago: {
    type: DataTypes.ENUM('Contra Entrega', 'Tarjeta', 'Transferencia', 'PSE'),
    defaultValue: 'Contra Entrega'
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
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
  
  // Timestamps
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'solicitudes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Métodos de instancia
Solicitud.prototype.canBeCancelled = function() {
  return ['pendiente', 'aceptada'].includes(this.estado);
};

Solicitud.prototype.canBeModified = function() {
  return this.estado === 'pendiente';
};

Solicitud.prototype.getStatusText = function() {
  const statusMap = {
    'pendiente': 'Pendiente',
    'aceptada': 'Aceptada',
    'rechazada': 'Rechazada',
    'en_proceso': 'En Proceso',
    'enviada': 'Enviada',
    'entregada': 'Entregada',
    'cancelada': 'Cancelada'
  };
  return statusMap[this.estado] || this.estado;
};

Solicitud.prototype.getPriorityText = function() {
  const priorityMap = {
    'baja': 'Baja',
    'normal': 'Normal',
    'alta': 'Alta',
    'urgente': 'Urgente'
  };
  return priorityMap[this.prioridad] || this.prioridad;
};

// Métodos estáticos
Solicitud.findByUser = function(usuarioId) {
  return this.findAll({ 
    where: { usuario_id: usuarioId },
    order: [['created_at', 'DESC']]
  });
};

Solicitud.findByStatus = function(estado) {
  return this.findAll({ 
    where: { estado },
    order: [['created_at', 'DESC']]
  });
};

Solicitud.findByOrderNumber = function(numero_pedido) {
  return this.findOne({ where: { numero_pedido } });
};

Solicitud.findPending = function() {
  return this.findAll({ 
    where: { estado: 'pendiente' },
    order: [['created_at', 'ASC']]
  });
};

Solicitud.findInProgress = function() {
  return this.findAll({ 
    where: { 
      estado: ['aceptada', 'en_proceso', 'enviada']
    },
    order: [['created_at', 'DESC']]
  });
};

Solicitud.findCompleted = function() {
  return this.findAll({ 
    where: { estado: 'entregada' },
    order: [['created_at', 'DESC']]
  });
};

Solicitud.getStats = function() {
  return this.findAll({
    attributes: [
      'estado',
      [sequelize.fn('COUNT', sequelize.col('id_solicitud')), 'count']
    ],
    group: ['estado']
  });
};

Solicitud.getSalesByDate = function(startDate, endDate) {
  return this.findAll({
    where: {
      fecha_solicitud: {
        [sequelize.Sequelize.Op.between]: [startDate, endDate]
      },
      estado: 'entregada'
    },
    attributes: [
      [sequelize.fn('DATE', sequelize.col('fecha_solicitud')), 'date'],
      [sequelize.fn('COUNT', sequelize.col('id_solicitud')), 'orders_count'],
      [sequelize.fn('SUM', sequelize.col('total')), 'total_sales']
    ],
    group: [sequelize.fn('DATE', sequelize.col('fecha_solicitud'))],
    order: [[sequelize.fn('DATE', sequelize.col('fecha_solicitud')), 'ASC']]
  });
};

module.exports = Solicitud;


