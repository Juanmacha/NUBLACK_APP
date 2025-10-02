const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Carrito = sequelize.define('Carrito', {
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
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  talla: {
    type: DataTypes.STRING(50),
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
  tableName: 'carrito',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['usuario_id', 'producto_id', 'talla']
    }
  ]
});

// Métodos de instancia
Carrito.prototype.incrementQuantity = async function(amount = 1) {
  this.cantidad += amount;
  return await this.save();
};

Carrito.prototype.decrementQuantity = async function(amount = 1) {
  this.cantidad = Math.max(1, this.cantidad - amount);
  return await this.save();
};

Carrito.prototype.updateQuantity = async function(newQuantity) {
  if (newQuantity <= 0) {
    return await this.destroy();
  }
  this.cantidad = newQuantity;
  return await this.save();
};

// Métodos estáticos
Carrito.findByUser = function(usuarioId) {
  return this.findAll({ 
    where: { usuario_id: usuarioId },
    order: [['created_at', 'DESC']]
  });
};

Carrito.findByUserAndProduct = function(usuarioId, productoId, talla = null) {
  const whereClause = { usuario_id: usuarioId, producto_id: productoId };
  if (talla) {
    whereClause.talla = talla;
  }
  return this.findOne({ where: whereClause });
};

Carrito.getUserCartCount = function(usuarioId) {
  return this.sum('cantidad', { where: { usuario_id: usuarioId } });
};

Carrito.clearUserCart = function(usuarioId) {
  return this.destroy({ where: { usuario_id: usuarioId } });
};

Carrito.addToCart = async function(usuarioId, productoId, cantidad = 1, talla = null) {
  const existingItem = await this.findByUserAndProduct(usuarioId, productoId, talla);
  
  if (existingItem) {
    return await existingItem.incrementQuantity(cantidad);
  } else {
    return await this.create({
      usuario_id: usuarioId,
      producto_id: productoId,
      cantidad: cantidad,
      talla: talla
    });
  }
};

Carrito.removeFromCart = async function(usuarioId, productoId, talla = null) {
  const whereClause = { usuario_id: usuarioId, producto_id: productoId };
  if (talla) {
    whereClause.talla = talla;
  }
  return await this.destroy({ where: whereClause });
};

Carrito.getCartWithProducts = function(usuarioId) {
  return this.findAll({
    where: { usuario_id: usuarioId },
    include: [{
      association: 'producto',
      where: { estado: 'activo' },
      required: true
    }],
    order: [['created_at', 'DESC']]
  });
};

Carrito.getCartTotal = async function(usuarioId) {
  const cartItems = await this.getCartWithProducts(usuarioId);
  return cartItems.reduce((total, item) => {
    return total + (item.cantidad * item.producto.precio);
  }, 0);
};

module.exports = Carrito;


