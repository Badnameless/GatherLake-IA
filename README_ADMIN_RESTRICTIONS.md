# Sistema de Restricciones de Acceso - Administradores

## Descripción

Este sistema implementa restricciones de acceso para que solo los usuarios con rol de **administrador** puedan acceder al dashboard y a los CRUD de la aplicación. Los usuarios con roles **guest** y **premium** serán redirigidos automáticamente a la vista de chat (`/`) si intentan acceder a estas rutas.

## Implementación

### 1. Middleware de Administrador

El middleware `AdminMiddleware` se encuentra en `app/Http/Middleware/AdminMiddleware.php` y realiza las siguientes verificaciones:

- **Autenticación**: Verifica que el usuario esté autenticado
- **Rol de Administrador**: Verifica que el usuario tenga el rol 'admin' en la base de datos
- **Redirección**: Si no cumple los requisitos, redirige según el tipo de petición:
  - **Rutas Web**: Redirige a `/` (vista de chat)
  - **Rutas API**: Retorna error JSON con código 401/403

### 2. Rutas Protegidas

#### Rutas Web (Frontend)
```php
// routes/web.php
// Dashboard - solo para administradores
Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['admin'])->name('dashboard');

// CRUD de usuarios - solo para administradores
Route::prefix('users')->middleware(['admin'])->group(function () {
    Route::get('/', function () { ... })->name('users.index');
    Route::get('/{id}', function ($id) { ... })->name('users.show');
    Route::get('/{id}/edit', function ($id) { ... })->name('users.edit');
});
```

#### Rutas API (Backend)
```php
// routes/api.php
Route::middleware(['auth', 'admin'])->group(function () {
    Route::post('/fetch/user', [UserController::class,'fetch']);
    Route::get("/get/user/all", [UserController::class,'all']);
    Route::post('/update/user', [UserController::class,'update']);
    Route::post('/user/email/exist', [UserController::class, 'emailIsTaken']);
});
```

### 3. Registro del Middleware

El middleware está registrado en `bootstrap/app.php` con el alias 'admin':

```php
$middleware->alias([
    'admin' => AdminMiddleware::class,
]);
```

## Roles de Usuario

### Roles Disponibles
- **admin**: Acceso completo al dashboard y todos los CRUD
- **premium**: Acceso restringido, redirigido a chat
- **guest**: Acceso restringido, redirigido a chat

### Usuarios de Prueba
- **Joel Cabrera** (joel@example.com) - Rol: admin
- **Pedro Perez** (pedro@example.com) - Rol: premium  
- **Saul Gonzales** (saul@example.com) - Rol: guest

## Comportamiento

### Para Usuarios Admin
- ✅ Acceso completo a `/dashboard`
- ✅ Acceso completo a `/users`
- ✅ Acceso completo a `/users/{id}`
- ✅ Acceso completo a `/users/{id}/edit`
- ✅ Acceso completo a todas las APIs de usuarios

### Para Usuarios Premium y Guest
- ❌ Intentar acceder a `/dashboard` → Redirigido a `/`
- ❌ Intentar acceder a `/users` → Redirigido a `/`
- ❌ Intentar acceder a `/users/{id}` → Redirigido a `/`
- ❌ Intentar acceder a `/users/{id}/edit` → Redirigido a `/`
- ❌ Intentar usar APIs de usuarios → Error 403

## Extensibilidad

Para agregar nuevos CRUD con las mismas restricciones, simplemente agrega el middleware `admin` a las rutas:

```php
Route::prefix('nuevo-crud')->middleware(['admin'])->group(function () {
    // Rutas del nuevo CRUD
});
```

## Notas Técnicas

- El sistema usa **Spatie Permission** para manejo de roles
- Las verificaciones se realizan directamente en la base de datos para evitar problemas de caché
- El middleware maneja tanto peticiones web como API automáticamente
- Los errores API retornan códigos HTTP apropiados (401 para no autenticado, 403 para no autorizado) 