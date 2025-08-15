# Componentes Globales del Frontend

Este documento describe los componentes globales creados para centralizar la funcionalidad del header y sidebar en la aplicación React.

## Componentes Creados

### 1. `GlobalHeader.tsx`
**Ubicación**: `resources/js/components/GlobalHeader.tsx`

**Funcionalidades**:
- Logo y navegación del panel izquierdo
- Información de tokens y plan del usuario
- Modal de información de tokens (clickeable)
- Acciones del header (búsqueda, notificaciones, configuración, ayuda)
- Avatar del usuario con modal desplegable
- Enlaces funcionales a Profile, Settings y Billing

**Props**:
- `userInfo`: Información del usuario (nombre, email, avatar, plan, tokens)
- `onLogout`: Función para manejar el logout

### 2. `GlobalSidebar.tsx`
**Ubicación**: `resources/js/components/GlobalSidebar.tsx`

**Funcionalidades**:
- Navegación principal del sidebar
- Enlaces a todas las páginas de la aplicación
- Indicador de página activa
- Enlace funcional "Asistente SQL" que lleva al chat

**Props**:
- `activePage`: Página actualmente activa
- `onLogout`: Función para manejar el logout

### 3. `FrontendLayout.tsx`
**Ubicación**: `resources/js/components/FrontendLayout.tsx`

**Funcionalidades**:
- Layout principal que combina `GlobalHeader` y `GlobalSidebar`
- Wrapper para todas las páginas del frontend
- Manejo consistente del estado de autenticación

**Props**:
- `userInfo`: Información del usuario
- `activePage`: Página activa para el sidebar
- `onLogout`: Función de logout
- `children`: Contenido de la página

## Páginas Migradas

### ✅ **Páginas Completamente Migradas**:

1. **`/chat`** - Página principal del chat
2. **`/pricing`** - Página de precios y planes
3. **`/checkout`** - Página de checkout
4. **`/documentation`** - Documentación
5. **`/faq`** - Preguntas frecuentes
6. **`/contact`** - Contacto
7. **`/changelog`** - Registro de cambios
8. **`/community-feed`** - Feed de la comunidad
9. **`/personal-feed`** - Feed personal
10. **`/finetuned-models`** - Modelos ajustados
11. **`/profile`** - Perfil del usuario ⭐ **NUEVA**
12. **`/settings`** - Configuración del usuario ⭐ **NUEVA**
13. **`/billing`** - Facturación y pagos ⭐ **NUEVA**

### 🔧 **Páginas del Backend (Laravel)**:
- **`/users`** - CRUD de usuarios (solo admin)
- **`/dashboard`** - Dashboard administrativo
- **`/connections`** - Gestión de conexiones
- **`/nl2sql`** - Herramienta NL2SQL

## Uso de los Componentes

### Para Páginas Nuevas:
```tsx
import React from 'react';
import { Head } from '@inertiajs/react';
import { useChat } from '../hooks/useChat';
import FrontendLayout from '../components/FrontendLayout';

export default function MiNuevaPagina() {
  const { chatData } = useChat();
  const { userInfo } = chatData;

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  return (
    <>
      <Head title="Mi Nueva Página - GatherLake AI" />
      
      <FrontendLayout userInfo={userInfo} activePage="mi-pagina" onLogout={handleLogout}>
        {/* Contenido de tu página aquí */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1>Mi Nueva Página</h1>
          {/* ... resto del contenido ... */}
        </div>
      </FrontendLayout>
    </>
  );
}
```

### Estructura de Página Típica:
```tsx
<FrontendLayout userInfo={userInfo} activePage="nombre-pagina" onLogout={handleLogout}>
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {/* Header de la página */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold">Título de la Página</h1>
      <p className="mt-2">Descripción de la página</p>
    </div>
    
    {/* Contenido principal */}
    <div className="rounded-2xl p-6" style={{ 
      backgroundColor: 'var(--techwave-some-r-bg-color)', 
      border: '1px solid var(--techwave-border-color)' 
    }}>
      {/* Contenido aquí */}
    </div>
  </div>
</FrontendLayout>
```

## Estilos CSS

Los componentes utilizan variables CSS personalizadas para mantener consistencia visual:

```css
:root {
  --techwave-main-color: #3b82f6;
  --techwave-heading-color: #1f2937;
  --techwave-body-color: #6b7280;
  --techwave-border-color: #e5e7eb;
  --techwave-some-r-bg-color: #f9fafb;
  --techwave-some-a-bg-color: #ffffff;
}
```

## Funcionalidades del Header

### Acciones Disponibles:
- **🔍 Búsqueda** - Navega a `/search`
- **🔔 Notificaciones** - Navega a `/notifications`
- **⚙️ Configuración** - Navega a `/settings`
- **❓ Ayuda** - Navega a `/help`
- **👤 Avatar** - Modal con opciones de perfil

### Modal de Tokens:
- Click en "Tokens Remain" abre información del plan
- Muestra plan actual, tokens disponibles, renovación y límites
- Enlace a `/pricing` para cambiar de plan

### Modal de Perfil:
- **Profile** - Navega a `/profile`
- **Settings** - Navega a `/settings`
- **Billing** - Navega a `/billing`
- **Log Out** - Función de logout

## Funcionalidades del Sidebar

### Enlaces Principales:
- **🏠 Inicio** - Página principal `/`
- **💬 Asistente SQL** - Chat principal `/`
- **📊 Dashboard** - Dashboard administrativo
- **🔗 Conexiones** - Gestión de conexiones
- **💰 Pricing** - Planes y precios
- **📚 Documentación** - Documentación
- **❓ FAQS** - Preguntas frecuentes
- **📞 Contacto** - Información de contacto
- **📝 Changelog** - Registro de cambios
- **👥 Community Feed** - Feed de la comunidad
- **👤 Personal Feed** - Feed personal
- **🤖 Finetuned Models** - Modelos ajustados

## Estado de Implementación

### ✅ **Completado**:
- Todas las páginas del frontend migradas a `FrontendLayout`
- Header completamente funcional con todas las acciones
- Sidebar funcional con navegación correcta
- Páginas de perfil, configuración y facturación creadas
- API endpoints para actualización de perfil y contraseña
- Build funcionando sin errores

### 🔄 **En Desarrollo**:
- Funcionalidad de búsqueda (`/search`)
- Sistema de notificaciones (`/notifications`)
- Página de ayuda (`/help`)

### 📝 **Notas Técnicas**:
- Todas las páginas usan el hook `useChat` para datos del usuario
- Formularios implementados con `useForm` de Inertia.js
- Validación de formularios en el backend
- Estilos consistentes usando variables CSS
- Responsive design implementado
- Iconos de Lucide React para consistencia visual

## Próximos Pasos

1. **Implementar funcionalidades faltantes**:
   - Sistema de búsqueda
   - Notificaciones en tiempo real
   - Página de ayuda

2. **Mejorar la experiencia del usuario**:
   - Feedback visual para formularios
   - Mensajes de éxito/error
   - Loading states

3. **Optimizaciones**:
   - Lazy loading de componentes
   - Caching de datos del usuario
   - Mejoras de performance 