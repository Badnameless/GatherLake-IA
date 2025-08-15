# Sistema de Usuarios Premium - GatherLake AI

## Descripción General

El sistema de usuarios premium permite a los usuarios actualizar su cuenta mediante un flujo de pricing y checkout. El sistema incluye 3 planes, validaciones frontend, estados de carga y actualización automática de roles.

## Flujo de Usuario

### 1. Registro de Usuario
- Los usuarios nuevos se registran automáticamente con el rol "guest"
- Tienen acceso limitado a tokens (50 tokens, límite diario de 100)

### 2. Proceso de Upgrade
- El usuario hace clic en el botón "Upgrade" en el header
- Se redirige a la página de Pricing con 3 planes disponibles
- Selecciona un plan (Pro o Ultra)
- Se redirige a la página de Checkout para completar el pago

### 3. Planes Disponibles

#### Free
- **Precio**: $0
- **Tokens**: 200 al día
- **Funcionalidades**: Básicas

#### Pro
- **Precio**: $19.99/mes
- **Tokens**: 1000 al mes
- **Funcionalidades**: Avanzadas

#### Ultra
- **Precio**: $99.99/mes
- **Tokens**: Ilimitados
- **Funcionalidades**: Completas

### 4. Validaciones Frontend
- **Email**: Formato válido de email
- **Número de tarjeta**: 16 dígitos con formato automático
- **Titular**: Mínimo 3 caracteres
- **Fecha de expiración**: Formato MM/YY
- **CVV**: 3-4 dígitos numéricos

### 5. Proceso de Pago
- Simulación de 2 segundos de procesamiento
- Llamada a la API para actualizar el rol a "premium"
- Estado de éxito con confirmación visual
- Redirección automática al chat

## Roles y Permisos

### Guest (Por defecto)
- **Tokens**: 50 disponibles, 100 límite diario
- **Plan**: Guest
- **Funcionalidades**: Limitadas

### Premium
- **Tokens**: Ilimitados (999,999)
- **Plan**: Premium
- **Funcionalidades**: Completas
- **Badge**: Indicador visual "⭐ Premium"

## Componentes Implementados

### 1. Página de Pricing (`resources/js/pages/pricing.tsx`)
- Diseño moderno con tema dark
- 3 planes: Free, Pro, Ultra
- Cards interactivas con hover effects
- Sección de FAQ
- Diseño responsivo

### 2. Página de Checkout (`resources/js/pages/checkout.tsx`)
- Formulario de pago con validaciones
- Resumen del pedido
- Estados: checkout → processing → success
- Tema dark consistente con la aplicación
- Redirección automática después del pago

### 3. Modificaciones en Chat (`resources/js/pages/chat.tsx`)
- Botón "Upgrade" que redirige a pricing
- Badge de Premium para usuarios premium
- Eliminación del modal de checkout

### 3. Backend (`app/Http/Controllers/UserController.php`)
- `upgradeToPremium()`: Actualiza rol a premium
- `getCurrentUser()`: Obtiene información del usuario con plan
- Lógica de tokens según el rol

### 4. Rutas API (`routes/api.php`)
- `POST /api/user/upgrade-to-premium`: Actualizar a premium
- `GET /api/user/current`: Obtener usuario actual

## Estilos CSS

### Header.css (`resources/css/Components/Header.css`)
- Estilos para el botón de upgrade con efectos hover
- Badge de premium con animaciones
- Gradientes y efectos visuales consistentes

### Características del Diseño
- **Colores**: Gradientes púrpura-azul (#667eea a #764ba2)
- **Animaciones**: Efectos de hover, glow y spin
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Consistencia**: Mantiene el estilo del proyecto

## Validaciones Frontend

### Formato de Tarjeta
```javascript
// Número de tarjeta: 1234 5678 9012 3456
// Fecha: MM/YY (ej: 12/25)
// CVV: 3-4 dígitos
```

### Validaciones Implementadas
- Formato de email con regex
- Número de tarjeta de 16 dígitos
- Fecha de expiración en formato MM/YY
- CVV numérico de 3-4 dígitos
- Nombre del titular mínimo 3 caracteres

## Estados del Sistema

### Estados del Modal
1. **Checkout**: Formulario de pago visible
2. **Processing**: Loading spinner durante el pago
3. **Success**: Confirmación de upgrade exitoso

### Estados del Usuario
- **Guest**: Botón "Upgrade" visible
- **Premium**: Badge "⭐ Premium" visible

## Configuración

### Tokens por Rol
```php
// Guest
$tokensRemaining = 50;
$dailyTokenLimit = 100;

// Premium
$tokensRemaining = 999999; // Ilimitado
$dailyTokenLimit = 999999;
```

### Precios de los Planes
- **Free**: $0 (200 tokens al día)
- **Pro**: $19.99/mes (1000 tokens al mes)
- **Ultra**: $99.99/mes (consultas ilimitadas)

## Uso

### Para Usuarios Nuevos
1. Registrarse en la aplicación
2. Automáticamente asignados como "guest"
3. Ver botón "Upgrade" en el header

### Para Upgrade a Premium
1. Hacer clic en "Upgrade"
2. Seleccionar plan en la página de Pricing
3. Completar formulario de pago en Checkout
4. Esperar procesamiento (2 segundos)
5. Confirmación de upgrade exitoso
6. Redirección automática al chat

### Para Usuarios Premium
- Ver badge "⭐ Premium" en lugar del botón upgrade
- Acceso a tokens ilimitados
- Todas las funcionalidades disponibles

## Notas Técnicas

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Laravel + Spatie Permission
- **Validaciones**: Solo frontend (simulación)
- **Persistencia**: Base de datos con roles
- **Seguridad**: CSRF protection en requests

## Extensibilidad

El sistema está diseñado para ser fácilmente extensible:
- Agregar nuevos planes (Pro, Enterprise)
- Implementar pasarelas de pago reales
- Añadir más validaciones backend
- Integrar con sistemas de facturación 