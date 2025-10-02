# 🛍️ API NUblack Backend

Backend API completo para la tienda de ropa y calzado deportivo NUblack, desarrollado con Node.js, Express y MySQL.

## 🚀 Características

- **Autenticación JWT** con refresh tokens
- **Gestión de usuarios** con roles (administrador, cliente, empleado)
- **Catálogo de productos** con categorías, filtros y búsqueda
- **Sistema de pedidos** completo con estados y seguimiento
- **Carrito de compras** persistente
- **Sistema de reseñas** de productos
- **Notificaciones por email** con Nodemailer
- **Validación de datos** robusta
- **Seguridad** con rate limiting, sanitización y CORS
- **Logging** completo con Winston
- **Documentación** de API integrada

## 📋 Requisitos Previos

- Node.js >= 16.0.0
- MySQL >= 8.0
- npm >= 8.0.0

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd API_NUBLACK_BACKEND
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar el archivo `.env` con tus configuraciones:
   ```env
   # Base de datos
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=NUblack
   DB_USER=root
   DB_PASSWORD=tu_password
   
   # JWT
   JWT_SECRET=tu_jwt_secret_super_seguro
   JWT_REFRESH_SECRET=tu_refresh_secret_super_seguro
   
   # Email (Nodemailer)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=tu_email@gmail.com
   SMTP_PASS=tu_app_password
   ```

4. **Configurar base de datos**
   ```bash
   # Crear base de datos MySQL
   mysql -u root -p
   CREATE DATABASE NUblack;
   ```

5. **Sincronizar base de datos**
   ```bash
   npm run fix-db
   ```

6. **Crear usuario administrador**
   ```bash
   npm run create-admin
   ```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

### Scripts Disponibles

```bash
npm start              # Iniciar servidor en producción
npm run dev            # Iniciar servidor en desarrollo con nodemon
npm run test           # Ejecutar tests
npm run fix-db         # Sincronizar base de datos
npm run create-admin   # Crear usuario administrador
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh-token` - Refrescar token
- `POST /api/auth/request-password-reset` - Solicitar recuperación
- `POST /api/auth/reset-password` - Restablecer contraseña
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)
- `GET /api/products/featured` - Productos destacados
- `GET /api/products/search` - Buscar productos

### Categorías
- `GET /api/categories` - Listar categorías
- `GET /api/categories/:id` - Obtener categoría
- `POST /api/categories` - Crear categoría (admin)
- `PUT /api/categories/:id` - Actualizar categoría (admin)
- `DELETE /api/categories/:id` - Eliminar categoría (admin)

### Pedidos
- `POST /api/orders` - Crear pedido
- `GET /api/orders/my-orders` - Mis pedidos
- `GET /api/orders/:id` - Obtener pedido
- `PUT /api/orders/:id/status` - Actualizar estado (admin)
- `POST /api/orders/:id/cancel` - Cancelar pedido

### Carrito
- `GET /api/cart` - Obtener carrito
- `POST /api/cart/add` - Agregar al carrito
- `PUT /api/cart/update` - Actualizar carrito
- `DELETE /api/cart/remove` - Eliminar del carrito
- `DELETE /api/cart/clear` - Limpiar carrito

### Usuarios (Admin)
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

## 🔐 Autenticación

La API usa JWT para autenticación. Incluye el token en el header:

```
Authorization: Bearer <tu_jwt_token>
```

## 📊 Base de Datos

### Estructura de Tablas

- **usuarios** - Información de usuarios
- **categorias** - Categorías de productos
- **productos** - Catálogo de productos
- **solicitudes** - Pedidos/solicitudes
- **detalles_solicitud** - Detalles de cada pedido
- **carrito** - Carrito de compras
- **reseñas** - Reseñas de productos
- **configuraciones** - Configuraciones del sistema
- **logs_actividad** - Logs de auditoría

## 🛡️ Seguridad

- **Rate Limiting** - Límite de requests por IP
- **Helmet** - Headers de seguridad HTTP
- **CORS** - Configuración de origen cruzado
- **Sanitización** - Limpieza de datos de entrada
- **Validación** - Validación robusta de datos
- **JWT** - Tokens seguros con expiración
- **Bcrypt** - Hash de contraseñas

## 📧 Email

Configurado con Nodemailer para:
- Emails de bienvenida
- Recuperación de contraseña
- Confirmación de pedidos
- Notificaciones del sistema

## 📝 Logging

Sistema de logging completo con Winston:
- Logs de aplicación en `logs/app.log`
- Logs de errores en `logs/error.log`
- Logs de auditoría para acciones importantes

## 🧪 Testing

```bash
npm test
```

## 🚀 Despliegue

### Variables de Entorno de Producción

```env
NODE_ENV=production
PORT=3001
DB_HOST=tu_host_mysql
DB_NAME=NUblack
DB_USER=tu_usuario
DB_PASSWORD=tu_password_seguro
JWT_SECRET=secret_super_seguro_produccion
SMTP_HOST=tu_smtp_host
SMTP_USER=tu_email
SMTP_PASS=tu_password_email
```

### Docker (Opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@nublack.com
- Documentación: `/api/info`
- Health Check: `/api/health`

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

---

**Desarrollado con ❤️ por el equipo NUblack**
