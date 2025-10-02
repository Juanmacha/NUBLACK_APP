# 🚀 Colección de Postman - API NUblack

Esta guía contiene ejemplos completos de todos los endpoints de la API NUblack para pruebas en Postman.

## 🚀 **SERVIDOR FUNCIONANDO**

✅ **Servidor Mock Activo**: `http://localhost:3001`
- Health Check: `http://localhost:3001/api/health`
- Info API: `http://localhost:3001/api/info`

### **Endpoints Disponibles en el Servidor Mock:**
✅ `GET /api/health` - Health Check
✅ `GET /api/info` - Información de la API
✅ `POST /api/auth/login` - Login (admin@nublack.com / admin123)
✅ `POST /api/auth/register` - Registro de usuario
✅ `GET /api/products` - Listar productos
✅ `GET /api/products/:id` - Obtener producto por ID
✅ `GET /api/categories` - Listar categorías
✅ `GET /api/categories/:id` - Obtener categoría por ID
✅ `GET /api/cart` - Obtener carrito
✅ `POST /api/cart/add` - Agregar al carrito
✅ `GET /api/orders/my-orders` - Mis pedidos
✅ `POST /api/orders` - Crear pedido

### **Credenciales de Prueba:**
- **Admin**: `admin@nublack.com` / `admin123`
- **Cliente**: Cualquier email válido / cualquier contraseña

## 📋 Configuración Inicial

### Variables de Entorno en Postman
Crea estas variables en Postman:
- `base_url`: `http://localhost:3001`
- `token`: (se llenará automáticamente después del login)
- `admin_token`: (se llenará automáticamente)
- `user_id`: (se llenará automáticamente)

### Headers Comunes
Para todas las requests que requieren autenticación:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

---

## 🔐 AUTENTICACIÓN

### 1. Registrar Usuario
**POST** `{{base_url}}/api/auth/register`

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "tipo_documento": "Cédula de Ciudadanía",
  "documento": "1234567890",
  "telefono": "3001234567",
  "email": "juan.perez@email.com",
  "password": "MiPassword123!",
  "rol": "cliente"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "usuario": {
      "id_usuario": 2,
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan.perez@email.com",
      "rol": "cliente",
      "estado": "activo"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Iniciar Sesión
**POST** `{{base_url}}/api/auth/login`

```json
{
  "email": "juan.perez@email.com",
  "password": "MiPassword123!"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "usuario": {
      "id_usuario": 2,
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan.perez@email.com",
      "rol": "cliente"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Login Administrador
**POST** `{{base_url}}/api/auth/login`

```json
{
  "email": "admin@nublack.com",
  "password": "admin123"
}
```

### 4. Obtener Perfil
**GET** `{{base_url}}/api/auth/profile`
*Requiere: Authorization header*

### 5. Actualizar Perfil
**PUT** `{{base_url}}/api/auth/profile`
*Requiere: Authorization header*

```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez García",
  "telefono": "3009876543"
}
```

### 6. Cambiar Contraseña
**POST** `{{base_url}}/api/auth/change-password`
*Requiere: Authorization header*

```json
{
  "currentPassword": "MiPassword123!",
  "newPassword": "MiNuevoPassword456!"
}
```

### 7. Solicitar Recuperación de Contraseña
**POST** `{{base_url}}/api/auth/request-password-reset`

```json
{
  "email": "juan.perez@email.com"
}
```

### 8. Restablecer Contraseña
**POST** `{{base_url}}/api/auth/reset-password`

```json
{
  "token": "token_recibido_por_email",
  "password": "MiNuevaPassword789!"
}
```

### 9. Refrescar Token
**POST** `{{base_url}}/api/auth/refresh-token`

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🛍️ PRODUCTOS

### 1. Obtener Todos los Productos
**GET** `{{base_url}}/api/products`

**Query Parameters:**
- `page=1` (opcional)
- `limit=10` (opcional)
- `search=zapatos` (opcional)
- `categoria_id=1` (opcional)
- `genero=Hombre` (opcional)
- `min_price=100000` (opcional)
- `max_price=500000` (opcional)
- `sort_by=precio` (opcional)
- `sort_order=ASC` (opcional)

### 2. Obtener Producto por ID
**GET** `{{base_url}}/api/products/1`

### 3. Buscar Productos
**GET** `{{base_url}}/api/products/search?q=zapatos&genero=Unisex&limit=5`

### 4. Productos Destacados
**GET** `{{base_url}}/api/products/featured?limit=8`

### 5. Productos Más Vendidos
**GET** `{{base_url}}/api/products/best-selling?limit=5`

### 6. Productos con Descuento
**GET** `{{base_url}}/api/products/discounted?limit=10`

### 7. Crear Producto (Admin/Staff)
**POST** `{{base_url}}/api/products`
*Requiere: Authorization header (Admin)*
*Nota: En el servidor mock, este endpoint devuelve 404. Usa el servidor completo con base de datos para esta funcionalidad.*

```json
{
  "nombre": "Jordan Air 1 Retro",
  "precio": 450000,
  "precio_original": 500000,
  "descripcion": "Zapatillas clásicas de Jordan con tecnología Air",
  "genero": "Unisex",
  "categoria_id": 1,
  "stock": 50,
  "rating": 4.8,
  "tallas": ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
  "imagenes": [
    "https://ejemplo.com/imagen1.jpg",
    "https://ejemplo.com/imagen2.jpg"
  ]
}
```

### 8. Actualizar Producto (Admin/Staff)
**PUT** `{{base_url}}/api/products/1`
*Requiere: Authorization header*

```json
{
  "nombre": "Jordan Air 1 Retro - Edición Especial",
  "precio": 480000,
  "stock": 30,
  "rating": 4.9
}
```

### 9. Actualizar Stock (Admin/Staff)
**PUT** `{{base_url}}/api/products/1/stock`
*Requiere: Authorization header*

```json
{
  "cantidad": 25
}
```

### 10. Eliminar Producto (Admin/Staff)
**DELETE** `{{base_url}}/api/products/1`
*Requiere: Authorization header*

### 11. Estadísticas de Productos (Admin)
**GET** `{{base_url}}/api/products/stats/overview`
*Requiere: Authorization header (Admin)*

---

## 📂 CATEGORÍAS

### 1. Obtener Todas las Categorías
**GET** `{{base_url}}/api/categories`

**Query Parameters:**
- `estado=Activo` (opcional)

### 2. Obtener Categoría por ID
**GET** `{{base_url}}/api/categories/1`

### 3. Categorías con Productos
**GET** `{{base_url}}/api/categories/with-products?limit=5`

### 4. Crear Categoría (Admin/Staff)
**POST** `{{base_url}}/api/categories`
*Requiere: Authorization header*

```json
{
  "nombre": "Accesorios",
  "descripcion": "Accesorios deportivos y de moda",
  "estado": "Activo"
}
```

### 5. Actualizar Categoría (Admin/Staff)
**PUT** `{{base_url}}/api/categories/1`
*Requiere: Authorization header*

```json
{
  "nombre": "Zapatos Deportivos",
  "descripcion": "Calzado deportivo de alta calidad"
}
```

### 6. Eliminar Categoría (Admin/Staff)
**DELETE** `{{base_url}}/api/categories/1`
*Requiere: Authorization header*

### 7. Estadísticas de Categorías (Admin)
**GET** `{{base_url}}/api/categories/stats/overview`
*Requiere: Authorization header (Admin)*

---

## 🛒 CARRITO DE COMPRAS

### 1. Obtener Carrito
**GET** `{{base_url}}/api/cart`
*Requiere: Authorization header*

### 2. Agregar al Carrito
**POST** `{{base_url}}/api/cart/add`
*Requiere: Authorization header*

```json
{
  "producto_id": 1,
  "cantidad": 2,
  "talla": "9"
}
```

### 3. Actualizar Item del Carrito
**PUT** `{{base_url}}/api/cart/update`
*Requiere: Authorization header*

```json
{
  "producto_id": 1,
  "cantidad": 3,
  "talla": "9"
}
```

### 4. Eliminar del Carrito
**DELETE** `{{base_url}}/api/cart/remove`
*Requiere: Authorization header*

```json
{
  "producto_id": 1,
  "talla": "9"
}
```

### 5. Limpiar Carrito
**DELETE** `{{base_url}}/api/cart/clear`
*Requiere: Authorization header*

### 6. Cantidad de Items
**GET** `{{base_url}}/api/cart/count`
*Requiere: Authorization header*

### 7. Validar Items del Carrito
**GET** `{{base_url}}/api/cart/validate`
*Requiere: Authorization header*

### 8. Ajustar Cantidades por Stock
**PUT** `{{base_url}}/api/cart/adjust`
*Requiere: Authorization header*

### 9. Resumen del Carrito
**GET** `{{base_url}}/api/cart/summary`
*Requiere: Authorization header*

---

## 📦 PEDIDOS

### 1. Crear Pedido
**POST** `{{base_url}}/api/orders`
*Requiere: Authorization header*

```json
{
  "nombre_cliente": "Juan Pérez",
  "documento_identificacion": "1234567890",
  "telefono_contacto": "3001234567",
  "correo_electronico": "juan.perez@email.com",
  "direccion_envio": "Calle 123 #45-67, Bogotá",
  "referencia_direccion": "Cerca al centro comercial",
  "indicaciones_adicionales": "Dejar en portería",
  "horario_preferido": "Mañana",
  "metodo_pago": "Contra Entrega",
  "tiempo_estimado_entrega": "2-3 días hábiles",
  "prioridad": "normal",
  "productos": [
    {
      "producto_id": 1,
      "cantidad": 2,
      "talla": "9"
    },
    {
      "producto_id": 2,
      "cantidad": 1,
      "talla": "M"
    }
  ]
}
```

### 2. Mis Pedidos
**GET** `{{base_url}}/api/orders/my-orders`
*Requiere: Authorization header*

**Query Parameters:**
- `page=1` (opcional)
- `limit=10` (opcional)
- `estado=pendiente` (opcional)
- `sort_by=created_at` (opcional)
- `sort_order=DESC` (opcional)

### 3. Obtener Pedido por ID
**GET** `{{base_url}}/api/orders/my-orders/1`
*Requiere: Authorization header*

### 4. Rastrear Pedido por Número
**GET** `{{base_url}}/api/orders/track/PED-ABC123`
*Público - No requiere autenticación*

### 5. Cancelar Pedido
**POST** `{{base_url}}/api/orders/1/cancel`
*Requiere: Authorization header*

### 6. Todos los Pedidos (Admin/Staff)
**GET** `{{base_url}}/api/orders/all`
*Requiere: Authorization header (Staff)*

**Query Parameters:**
- `page=1` (opcional)
- `limit=10` (opcional)
- `estado=pendiente` (opcional)
- `fecha_inicio=2024-01-01` (opcional)
- `fecha_fin=2024-12-31` (opcional)

### 7. Actualizar Estado del Pedido (Admin/Staff)
**PUT** `{{base_url}}/api/orders/1/status`
*Requiere: Authorization header (Staff)*

```json
{
  "estado": "aceptada",
  "motivo_rechazo": null
}
```

**Estados disponibles:**
- `pendiente`
- `aceptada`
- `rechazada`
- `en_proceso`
- `enviada`
- `entregada`
- `cancelada`

### 8. Estadísticas de Pedidos (Admin)
**GET** `{{base_url}}/api/orders/stats/overview`
*Requiere: Authorization header (Admin)*

**Query Parameters:**
- `fecha_inicio=2024-01-01` (opcional)
- `fecha_fin=2024-12-31` (opcional)

---

## 👥 USUARIOS (Admin)

### 1. Listar Usuarios
**GET** `{{base_url}}/api/users`
*Requiere: Authorization header (Admin)*

**Query Parameters:**
- `page=1` (opcional)
- `limit=10` (opcional)
- `search=juan` (opcional)
- `rol=cliente` (opcional)
- `estado=activo` (opcional)

### 2. Obtener Usuario por ID
**GET** `{{base_url}}/api/users/1`
*Requiere: Authorization header (Admin)*

### 3. Crear Usuario
**POST** `{{base_url}}/api/users`
*Requiere: Authorization header (Admin)*

```json
{
  "nombre": "María",
  "apellido": "González",
  "tipo_documento": "Cédula de Ciudadanía",
  "documento": "9876543210",
  "telefono": "3009876543",
  "email": "maria.gonzalez@email.com",
  "password": "SuPassword123!",
  "rol": "cliente"
}
```

### 4. Actualizar Usuario
**PUT** `{{base_url}}/api/users/1`
*Requiere: Authorization header (Admin)*

```json
{
  "nombre": "María Elena",
  "apellido": "González López",
  "telefono": "3001111111",
  "estado": "activo"
}
```

### 5. Cambiar Estado del Usuario
**PUT** `{{base_url}}/api/users/1/status`
*Requiere: Authorization header (Admin)*

```json
{
  "estado": "inactivo"
}
```

### 6. Eliminar Usuario
**DELETE** `{{base_url}}/api/users/1`
*Requiere: Authorization header (Admin)*

### 7. Buscar Usuarios
**GET** `{{base_url}}/api/users/search?q=maria&limit=5`
*Requiere: Authorization header (Admin)*

### 8. Estadísticas de Usuarios
**GET** `{{base_url}}/api/users/stats`
*Requiere: Authorization header (Admin)*

---

## 🏥 ENDPOINTS DEL SISTEMA

### 1. Health Check
**GET** `{{base_url}}/api/health`

### 2. Información de la API
**GET** `{{base_url}}/api/info`

### 3. Página Principal
**GET** `{{base_url}}/`

---

## 🔧 CONFIGURACIÓN DE POSTMAN

### 1. Crear Variables de Entorno
1. Ve a **Environments** en Postman
2. Crea un nuevo environment llamado "NUblack API"
3. Agrega estas variables:
   - `base_url`: `http://localhost:3001`
   - `token`: (vacío inicialmente)
   - `user_id`: (vacío inicialmente)

### 2. Script de Pre-request (Opcional)
Para automatizar el guardado del token después del login, agrega este script en la pestaña **Pre-request Script** de las requests de login:

```javascript
// Script para guardar automáticamente el token
pm.test("Save token", function () {
    var jsonData = pm.response.json();
    if (jsonData.success && jsonData.data.accessToken) {
        pm.environment.set("token", jsonData.data.accessToken);
        pm.environment.set("user_id", jsonData.data.usuario.id_usuario);
    }
});
```

### 3. Colección de Postman
Puedes importar esta colección completa creando un archivo JSON con todos los endpoints organizados.

---

## 📝 NOTAS IMPORTANTES

1. **Autenticación**: La mayoría de endpoints requieren el header `Authorization: Bearer {{token}}`
2. **Roles**: Algunos endpoints solo están disponibles para administradores o staff
3. **Validación**: Todos los datos de entrada son validados según las reglas del backend
4. **Rate Limiting**: Hay límites de requests por IP para prevenir abuso
5. **CORS**: La API está configurada para aceptar requests desde `http://localhost:3000`

---

## 🚀 FLUJO DE PRUEBAS RECOMENDADO

### **PRIMEROS PASOS (Servidor Mock Funcionando):**

1. **Health Check** → `GET {{base_url}}/api/health`
2. **Login Admin** → `POST {{base_url}}/api/auth/login`
   ```json
   {
     "email": "admin@nublack.com",
     "password": "admin123"
   }
   ```
3. **Ver Productos** → `GET {{base_url}}/api/products`
4. **Ver Categorías** → `GET {{base_url}}/api/categories`
5. **Registrar Usuario** → `POST {{base_url}}/api/auth/register`
6. **Crear Pedido** → `POST {{base_url}}/api/orders`

### **FLUJO COMPLETO (Cuando configures MySQL):**

1. **Configurar variables de entorno**
2. **Registrar un usuario nuevo**
3. **Hacer login y guardar el token**
4. **Crear algunas categorías (como admin)**
5. **Crear productos (como admin)**
6. **Agregar productos al carrito (como usuario)**
7. **Crear un pedido**
8. **Probar gestión de pedidos (como admin)**

¡Con esta guía tienes todo lo necesario para probar completamente la API NUblack en Postman! 🎉
