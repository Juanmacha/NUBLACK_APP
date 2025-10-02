const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DetalleSolicitud = sequelize.define('DetalleSolicitud', {
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
    allowNull: false,
    validate: {
      min: 1
    }
  },
  talla: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  precio_unitario: {
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
  // Timestamps
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'detalles_solicitud',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Hooks para calcular subtotal automáticamente
DetalleSolicitud.beforeCreate((detalle) => {
  detalle.subtotal = detalle.cantidad * detalle.precio_unitario;
});

DetalleSolicitud.beforeUpdate((detalle) => {
  if (detalle.changed('cantidad') || detalle.changed('precio_unitario')) {
    detalle.subtotal = detalle.cantidad * detalle.precio_unitario;
  }
});

// Métodos de instancia
DetalleSolicitud.prototype.getTotal = function() {
  return this.cantidad * this.precio_unitario;
};

DetalleSolicitud.prototype.updateQuantity = async function(newQuantity) {
  this.cantidad = newQuantity;
  this.subtotal = this.cantidad * this.precio_unitario;
  return await this.save();
};

// Métodos estáticos
DetalleSolicitud.findBySolicitud = function(solicitudId) {
  return this.findAll({ 
    where: { solicitud_id: solicitudId },
    order: [['created_at', 'ASC']]
  });
};

DetalleSolicitud.findByProduct = function(productoId) {
  return this.findAll({ 
    where: { producto_id: productoId },
    order: [['created_at', 'DESC']]
  });
};

DetalleSolicitud.getProductStats = function(productoId) {
  return this.findAll({
    where: { producto_id: productoId },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('cantidad')), 'total_quantity'],
      [sequelize.fn('COUNT', sequelize.col('id_detalle')), 'total_orders'],
      [sequelize.fn('SUM', sequelize.col('subtotal')), 'total_revenue']
    ]
  });
};

DetalleSolicitud.getTopSellingProducts = function(limit = 10) {
  return this.findAll({
    attributes: [
      'producto_id',
      'nombre_producto',
      [sequelize.fn('SUM', sequelize.col('cantidad')), 'total_sold'],
      [sequelize.fn('SUM', sequelize.col('subtotal')), 'total_revenue']
    ],
    group: ['producto_id', 'nombre_producto'],
    order: [[sequelize.fn('SUM', sequelize.col('cantidad')), 'DESC']],
    limit
  });
};

module.exports = DetalleSolicitud;


