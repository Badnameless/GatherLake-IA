import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export function useAuth() {
  const { auth } = usePage<SharedData>().props;
  
  // Determinar el plan basado en los roles del usuario
  const getUserPlan = () => {
    if (!auth.user || !auth.user.roles) return 'Free';
    
    if (auth.user.roles.includes('admin')) return 'Admin';
    if (auth.user.roles.includes('premium')) return 'Premium';
    if (auth.user.roles.includes('guest')) return 'Guest';
    
    return 'Free';
  };

  // Determinar tokens basados en el plan
  const getTokensRemaining = () => {
    const plan = getUserPlan();
    switch (plan) {
      case 'Admin':
        return 9999;
      case 'Premium':
        return 1000;
      case 'Guest':
        return 100;
      default:
        return 200;
    }
  };

  const userInfo = {
    name: auth.user?.name || 'Usuario',
    email: auth.user?.email || '',
    avatar: './images/avatar.jpg', // Imagen estática fija
    plan: getUserPlan(),
    tokensRemaining: getTokensRemaining(),
    roles: auth.user?.roles || []
  };

  return {
    user: auth.user,
    userInfo
  };
} 