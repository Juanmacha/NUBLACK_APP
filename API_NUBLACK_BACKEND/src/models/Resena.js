const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Resena = sequelize.define('Resena', {
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
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'),
    defaultValue: 'pendiente'
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
  tableName: 'reseñas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['usuario_id', 'producto_id']
    }
  ]
});

// Métodos de instancia
Resena.prototype.approve = async function() {
  this.estado = 'aprobada';
  return await this.save();
};

Resena.prototype.reject = async function() {
  this.estado = 'rechazada';
  return await this.save();
};

Resena.prototype.isApproved = function() {
  return this.estado === 'aprobada';
};

Resena.prototype.getStars = function() {
  return '★'.repeat(this.calificacion) + '☆'.repeat(5 - this.calificacion);
};

// Métodos estáticos
Resena.findByProduct = function(productoId, approvedOnly = true) {
  const whereClause = { producto_id: productoId };
  if (approvedOnly) {
    whereClause.estado = 'aprobada';
  }
  
  return this.findAll({ 
    where: whereClause,
    include: [{
      association: 'usuario',
      attributes: ['nombre', 'apellido']
    }],
    order: [['created_at', 'DESC']]
  });
};

Resena.findByUser = function(usuarioId) {
  return this.findAll({ 
    where: { usuario_id: usuarioId },
    include: [{
      association: 'producto',
      attributes: ['nombre', 'imagen']
    }],
    order: [['created_at', 'DESC']]
  });
};

Resena.findPending = function() {
  return this.findAll({ 
    where: { estado: 'pendiente' },
    include: [
      {
        association: 'usuario',
        attributes: ['nombre', 'apellido', 'email']
      },
      {
        association: 'producto',
        attributes: ['nombre', 'imagen']
      }
    ],
    order: [['created_at', 'ASC']]
  });
};

Resena.getProductRating = function(productoId) {
  return this.findAll({
    where: { 
      producto_id: productoId,
      estado: 'aprobada'
    },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('calificacion')), 'average_rating'],
      [sequelize.fn('COUNT', sequelize.col('id_resena')), 'total_reviews']
    ]
  });
};

Resena.getProductStats = function(productoId) {
  return this.findAll({
    where: { 
      producto_id: productoId,
      estado: 'aprobada'
    },
    attributes: [
      'calificacion',
      [sequelize.fn('COUNT', sequelize.col('id_resena')), 'count']
    ],
    group: ['calificacion'],
    order: [['calificacion', 'DESC']]
  });
};

Resena.getTopRatedProducts = function(limit = 10) {
  return this.findAll({
    attributes: [
      'producto_id',
      [sequelize.fn('AVG', sequelize.col('calificacion')), 'average_rating'],
      [sequelize.fn('COUNT', sequelize.col('id_resena')), 'total_reviews']
    ],
    where: { estado: 'aprobada' },
    group: ['producto_id'],
    having: sequelize.where(sequelize.fn('COUNT', sequelize.col('id_resena')), '>=', 3),
    order: [[sequelize.fn('AVG', sequelize.col('calificacion')), 'DESC']],
    limit
  });
};

Resena.getRecentReviews = function(limit = 10) {
  return this.findAll({
    where: { estado: 'aprobada' },
    include: [
      {
        association: 'usuario',
        attributes: ['nombre', 'apellido']
      },
      {
        association: 'producto',
        attributes: ['nombre', 'imagen']
      }
    ],
    order: [['created_at', 'DESC']],
    limit
  });
};

module.exports = Resena;


