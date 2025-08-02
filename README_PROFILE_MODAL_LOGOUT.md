# Modal de Perfil y Funcionalidad de Logout

## Descripción

Se han implementado las funcionalidades del modal de perfil y el botón de logout en la aplicación de chat. Estas funcionalidades permiten a los usuarios acceder a su información de perfil y cerrar sesión de manera segura.

## Funcionalidades Implementadas

### 1. Modal de Perfil

#### Características:
- **Activación**: Click en el avatar del usuario en el header
- **Contenido**: Información del usuario, opciones de perfil, configuración, facturación y logout
- **Cierre**: Click fuera del modal o click en el avatar nuevamente
- **Posicionamiento**: Modal desplegable desde el avatar hacia abajo

#### Estructura del Modal:
```jsx
<div className="Header__actions--avatar-container">
  <div className="Header__actions--avatar" onClick={toggleProfileModal}>
    <img src={userInfo.avatar} alt="" />
  </div>
  <div className={`Header__actions--avatar-modal ${showProfileModal ? 'show' : ''}`}>
    {/* Contenido del modal */}
  </div>
</div>
```

#### Opciones del Modal:
- **Profile**: Acceso al perfil del usuario
- **Settings**: Configuración de la cuenta
- **Billing**: Información de facturación
- **Log Out**: Cerrar sesión

### 2. Funcionalidad de Logout

#### Implementación:
- **Método**: POST request a `/logout`
- **Controlador**: `AuthenticatedSessionController@destroy`
- **Redirección**: Después del logout, redirige a `/` (vista de chat)
- **Seguridad**: Invalida la sesión y regenera el token CSRF

#### Código del Hook:
```typescript
const handleLogout = useCallback(() => {
  router.post('/logout');
}, []);
```

#### Controlador Laravel:
```php
public function destroy(Request $request): RedirectResponse
{
    Auth::guard('web')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
}
```

## Estilos CSS

### Modal de Perfil:
```css
.Header__actions--avatar-modal {
    opacity: 0;
    visibility: hidden;
    transform: translateY(30px);
    transition: .2s;
    z-index: 1000;
}

.Header__actions--avatar-modal.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0px);
    transition: .2s;
}
```

### Avatar Interactivo:
```css
.Header__actions--avatar {
    cursor: pointer;
    transition: .3s ease-in-out;
}

.Header__actions--avatar:hover {
    border-color: var(--techwave-main-color);
}
```

## Hook useChat Actualizado

### Nuevos Estados:
```typescript
const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
```

### Nuevas Funciones:
```typescript
// Toggle profile modal
const toggleProfileModal = useCallback(() => {
  setShowProfileModal(prev => !prev);
}, []);

// Handle logout
const handleLogout = useCallback(() => {
  router.post('/logout');
}, []);
```

### Event Listeners:
```typescript
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (showProfileModal) {
      const target = event.target as Element;
      if (!target.closest('.Header__actions--avatar-container')) {
        setShowProfileModal(false);
      }
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showProfileModal]);
```

## Rutas Configuradas

### Logout Route:
```php
// routes/auth.php
Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');
```

## Comportamiento del Usuario

### Para Acceder al Modal:
1. Click en el avatar del usuario en el header
2. El modal se despliega mostrando las opciones
3. Click en cualquier opción para navegar o cerrar sesión

### Para Cerrar Sesión:
1. Click en el avatar → Modal se abre
2. Click en "Log Out" → Sesión se cierra
3. Usuario es redirigido a la vista de chat (página principal)

### Para Cerrar el Modal:
1. Click fuera del modal
2. Click nuevamente en el avatar
3. Click en cualquier opción del modal

## Notas Técnicas

- **Inertia.js**: Se utiliza `router.post()` para el logout
- **Laravel Sanctum**: Manejo de autenticación web
- **CSS Transitions**: Animaciones suaves para el modal
- **Event Delegation**: Manejo de clicks fuera del modal
- **Z-index**: Modal con z-index alto para estar por encima de otros elementos

## Seguridad

- **CSRF Protection**: Laravel maneja automáticamente la protección CSRF
- **Session Invalidation**: La sesión se invalida completamente al hacer logout
- **Token Regeneration**: Se regenera el token CSRF después del logout
- **Redirect**: Redirección segura después del logout 