const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Producto = sequelize.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      len: [3, 150],
      notEmpty: true
    }
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  precio_original: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
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
    allowNull: true,
    defaultValue: []
  },
  talla: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tallas: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
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
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 4.5,
    validate: {
      min: 0,
      max: 5
    }
  },
  variantes: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
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
  tableName: 'productos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Métodos de instancia
Producto.prototype.isInStock = function() {
  return this.stock > 0;
};

Producto.prototype.hasDiscount = function() {
  return this.precio_original && this.precio_original > this.precio;
};

Producto.prototype.getDiscountPercentage = function() {
  if (!this.hasDiscount()) return 0;
  return Math.round(((this.precio_original - this.precio) / this.precio_original) * 100);
};

Producto.prototype.updateStock = async function(cantidad) {
  this.stock = Math.max(0, this.stock - cantidad);
  return await this.save();
};

// Métodos estáticos
Producto.findActive = function() {
  return this.findAll({ where: { estado: 'activo' } });
};

Producto.findByCategory = function(categoriaId) {
  return this.findAll({ 
    where: { 
      categoria_id: categoriaId,
      estado: 'activo' 
    } 
  });
};

Producto.findByGender = function(genero) {
  return this.findAll({ 
    where: { 
      genero,
      estado: 'activo' 
    } 
  });
};

Producto.findInStock = function() {
  return this.findAll({ 
    where: { 
      stock: { [sequelize.Sequelize.Op.gt]: 0 },
      estado: 'activo' 
    } 
  });
};

Producto.findWithDiscount = function() {
  return this.findAll({ 
    where: { 
      precio_original: { [sequelize.Sequelize.Op.gt]: sequelize.col('precio') },
      estado: 'activo' 
    } 
  });
};

Producto.searchByName = function(searchTerm) {
  return this.findAll({
    where: {
      nombre: {
        [sequelize.Sequelize.Op.like]: `%${searchTerm}%`
      },
      estado: 'activo'
    }
  });
};

Producto.findTopRated = function(limit = 10) {
  return this.findAll({
    where: { estado: 'activo' },
    order: [['rating', 'DESC']],
    limit
  });
};

Producto.findMostSold = function(limit = 10) {
  return this.findAll({
    where: { estado: 'activo' },
    order: [['stock', 'ASC']], // Menor stock = más vendido
    limit
  });
};

module.exports = Producto;


