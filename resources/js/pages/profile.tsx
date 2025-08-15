import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useAuth } from '@/hooks/useAuth';
import FrontendLayout from '../components/FrontendLayout';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Zap, 
  Clock, 
  Database, 
  Star,
  Crown,
  Gift
} from 'lucide-react';

export default function Profile() {
  const { userInfo } = useAuth();

  const handleLogout = () => {
    router.post('/logout');
  };

  // Calcular fecha de registro (simulada por ahora)
  const registrationDate = new Date();
  registrationDate.setMonth(registrationDate.getMonth() - 3); // 3 meses atrás

  // Información del plan
  const planInfo = {
    free: { 
      name: 'Free', 
      color: 'var(--techwave-body-color)', 
      bgColor: 'var(--techwave-some-a-bg-color)', 
      icon: Gift 
    },
    premium: { 
      name: 'Premium', 
      color: 'var(--techwave-main-color)', 
      bgColor: 'var(--techwave-some-a-bg-color)', 
      icon: Star 
    },
    admin: { 
      name: 'Admin', 
      color: '#8b5cf6', 
      bgColor: 'var(--techwave-some-a-bg-color)', 
      icon: Crown 
    },
    guest: { 
      name: 'Guest', 
      color: 'var(--techwave-body-color)', 
      bgColor: 'var(--techwave-some-a-bg-color)', 
      icon: Gift 
    }
  };

  // Mapear el plan del usuario a la configuración correspondiente
  const getPlanConfig = (plan: string) => {
    const planKey = plan.toLowerCase();
    return planInfo[planKey as keyof typeof planInfo] || planInfo.free;
  };

  const currentPlan = getPlanConfig(userInfo.plan);
  const PlanIcon = currentPlan.icon;

  return (
    <>
      <Head title="Profile - GatherLake AI" />
      
      <FrontendLayout userInfo={userInfo} activePage="profile" onLogout={handleLogout}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8 pt-[40px]">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>
              Perfil de Usuario
            </h1>
            <p className="mt-2" style={{ color: 'var(--techwave-body-color)' }}>
              Información completa de tu cuenta y estadísticas
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda - Información Principal */}
            <div className="lg:col-span-1 space-y-6">
              {/* Avatar y Información Básica */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={userInfo.avatar || './images/avatar.jpg'}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full object-cover border-4"
                      style={{ borderColor: 'var(--techwave-border-color)' }}
                    />
                    <div className="absolute -bottom-2 -right-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center"
                           style={{ backgroundColor: currentPlan.bgColor }}>
                        <PlanIcon className="w-4 h-4" style={{ color: currentPlan.color }} />
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    {userInfo.name || 'Usuario'}
                  </h2>
                  
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                       style={{ backgroundColor: currentPlan.bgColor }}>
                    <PlanIcon className="w-4 h-4 mr-2" style={{ color: currentPlan.color }} />
                    <span style={{ color: currentPlan.color }}>{currentPlan.name}</span>
                  </div>
                </div>
              </div>

              {/* Estadísticas Rápidas */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                  Estadísticas Rápidas
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 mr-3" style={{ color: 'var(--techwave-main-color)' }} />
                      <span style={{ color: 'var(--techwave-body-color)' }}>Tokens Usados</span>
                    </div>
                    <span className="font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>
                      {/* Calcular tokens usados basado en el plan */}
                      {userInfo.plan === 'Free' ? 200 - userInfo.tokensRemaining :
                       userInfo.plan === 'Premium' ? 1000 - userInfo.tokensRemaining :
                       userInfo.plan === 'Admin' ? 9999 - userInfo.tokensRemaining :
                       100 - userInfo.tokensRemaining}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="w-5 h-5 mr-3" style={{ color: 'var(--techwave-main-color)' }} />
                      <span style={{ color: 'var(--techwave-body-color)' }}>Conexiones</span>
                    </div>
                    <span className="font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>
                      {userInfo.plan === 'Free' ? '1' : userInfo.plan === 'Premium' ? '5' : '∞'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-3" style={{ color: 'var(--techwave-main-color)' }} />
                      <span style={{ color: 'var(--techwave-body-color)' }}>Sesiones</span>
                    </div>
                    <span className="font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>
                      {/* Por ahora hardcodeado, se puede obtener de la API */}
                      12
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Información Detallada */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información Personal */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--techwave-heading-color)' }}>
                  Información Personal
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <User className="w-5 h-5" style={{ color: 'var(--techwave-main-color)' }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>Nombre Completo</p>
                      <p className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                        {userInfo.name || 'No especificado'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <Mail className="w-5 h-5" style={{ color: 'var(--techwave-main-color)' }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>Email</p>
                      <p className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                        {userInfo.email || 'No especificado'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <Calendar className="w-5 h-5" style={{ color: 'var(--techwave-main-color)' }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>Miembro Desde</p>
                      <p className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                        {registrationDate.toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <Shield className="w-5 h-5" style={{ color: 'var(--techwave-main-color)' }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>Estado de Verificación</p>
                      <p className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                        Verificado ✓
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del Plan */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--techwave-heading-color)' }}>
                  Información del Plan
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <Crown className="w-5 h-5" style={{ color: 'var(--techwave-main-color)' }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>Plan Actual</p>
                      <p className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                        {userInfo.plan || 'Free'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <Zap className="w-5 h-5" style={{ color: 'var(--techwave-main-color)' }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>Tokens Disponibles</p>
                      <p className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                        {userInfo.tokensRemaining || 0}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <Clock className="w-5 h-5" style={{ color: 'var(--techwave-main-color)' }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>Renovación de Tokens</p>
                      <p className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                        {userInfo.tokensResetTime || '24 horas'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <Database className="w-5 h-5" style={{ color: 'var(--techwave-main-color)' }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>Límite Diario</p>
                      <p className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                        {userInfo.dailyTokenLimit || 200}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--techwave-heading-color)' }}>
                  Acciones
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => window.location.href = '/settings'}
                    className="flex items-center justify-center px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    style={{
                      backgroundColor: 'var(--techwave-main-color)',
                      color: 'white'
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/billing'}
                    className="flex items-center justify-center px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    style={{
                      backgroundColor: 'var(--techwave-some-a-bg-color)',
                      color: 'var(--techwave-heading-color)',
                      border: '1px solid var(--techwave-border-color)'
                    }}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Cambiar Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FrontendLayout>
    </>
  );
} 