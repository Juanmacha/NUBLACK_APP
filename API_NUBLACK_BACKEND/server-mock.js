const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Datos mock para pruebas
const mockData = {
  usuarios: [
    {
      id_usuario: 1,
      nombre: 'Admin',
      apellido: 'NUBLACK',
      email: 'admin@nublack.com',
      rol: 'administrador',
      estado: 'activo'
    },
    {
      id_usuario: 2,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@email.com',
      rol: 'cliente',
      estado: 'activo'
    }
  ],
  categorias: [
    {
      id_categoria: 1,
      nombre: 'Zapatos Deportivos',
      descripcion: 'Calzado deportivo de alta calidad',
      estado: 'Activo'
    },
    {
      id_categoria: 2,
      nombre: 'Ropa Deportiva',
      descripcion: 'Ropa para actividades deportivas',
      estado: 'Activo'
    }
  ],
  productos: [
    {
      id_producto: 1,
      nombre: 'Jordan Air 1 Retro',
      precio: 450000,
      precio_original: 500000,
      descripcion: 'Zapatillas clásicas de Jordan con tecnología Air',
      genero: 'Unisex',
      categoria_id: 1,
      stock: 50,
      rating: 4.8,
      tallas: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
      imagenes: ['https://ejemplo.com/jordan1.jpg'],
      estado: 'Activo'
    },
    {
      id_producto: 2,
      nombre: 'Nike Air Max 270',
      precio: 380000,
      precio_original: 420000,
      descripcion: 'Zapatillas Nike con tecnología Air Max',
      genero: 'Unisex',
      categoria_id: 1,
      stock: 30,
      rating: 4.6,
      tallas: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
      imagenes: ['https://ejemplo.com/airmax270.jpg'],
      estado: 'Activo'
    }
  ],
  pedidos: []
};

// Rutas de la API

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API NUblack funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Información de la API
app.get('/api/info', (req, res) => {
  res.json({
    name: 'NUblack API',
    version: '1.0.0',
    description: 'API para el sistema de e-commerce NUblack',
    endpoints: {
      auth: '/api/auth/*',
      products: '/api/products/*',
      categories: '/api/categories/*',
      cart: '/api/cart/*',
      orders: '/api/orders/*',
      users: '/api/users/*'
    }
  });
});

// Autenticación
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = mockData.usuarios.find(u => u.email === email);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }
  
  // Mock token (en producción sería un JWT real)
  const token = `mock_token_${user.id_usuario}_${Date.now()}`;
  
  res.json({
    success: true,
    message: 'Inicio de sesión exitoso',
    data: {
      usuario: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol
      },
      accessToken: token,
      refreshToken: `refresh_${token}`
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  
  const newUser = {
    id_usuario: mockData.usuarios.length + 1,
    nombre,
    apellido,
    email,
    rol: 'cliente',
    estado: 'activo'
  };
  
  mockData.usuarios.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'Usuario registrado exitosamente',
    data: {
      usuario: newUser,
      accessToken: `mock_token_${newUser.id_usuario}_${Date.now()}`,
      refreshToken: `refresh_mock_token_${newUser.id_usuario}_${Date.now()}`
    }
  });
});

// Productos
app.get('/api/products', (req, res) => {
  const { page = 1, limit = 10, search, categoria_id, genero } = req.query;
  
  let filteredProducts = [...mockData.productos];
  
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.nombre.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (categoria_id) {
    filteredProducts = filteredProducts.filter(p => p.categoria_id == categoria_id);
  }
  
  if (genero) {
    filteredProducts = filteredProducts.filter(p => p.genero === genero);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      productos: paginatedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limit)
      }
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const producto = mockData.productos.find(p => p.id_producto == id);
  
  if (!producto) {
    return res.status(404).json({
      success: false,
      message: 'Producto no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: producto
  });
});

// Categorías
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: mockData.categorias
  });
});

app.get('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const categoria = mockData.categorias.find(c => c.id_categoria == id);
  
  if (!categoria) {
    return res.status(404).json({
      success: false,
      message: 'Categoría no encontrada'
    });
  }
  
  res.json({
    success: true,
    data: categoria
  });
});

// Carrito (mock simple)
app.get('/api/cart', (req, res) => {
  res.json({
    success: true,
    data: {
      items: [],
      total: 0,
      count: 0
    }
  });
});

app.post('/api/cart/add', (req, res) => {
  res.json({
    success: true,
    message: 'Producto agregado al carrito'
  });
});

// Pedidos
app.get('/api/orders/my-orders', (req, res) => {
  res.json({
    success: true,
    data: {
      pedidos: mockData.pedidos,
      pagination: {
        page: 1,
        limit: 10,
        total: mockData.pedidos.length,
        pages: 1
      }
    }
  });
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    id_solicitud: mockData.pedidos.length + 1,
    numero_pedido: `PED-${Date.now()}`,
    ...req.body,
    estado: 'pendiente',
    fecha_solicitud: new Date().toISOString()
  };
  
  mockData.pedidos.push(newOrder);
  
  res.status(201).json({
    success: true,
    message: 'Pedido creado exitosamente',
    data: newOrder
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a la API de NUblack!',
    version: '1.0.0',
    status: 'funcionando',
    endpoints: '/api/health, /api/info'
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    path: req.originalUrl
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor NUblack ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Info API: http://localhost:${PORT}/api/info`);
  console.log(`🎯 Listo para pruebas en Postman!`);
});

module.exports = app;


