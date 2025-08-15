import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CreditCard, CheckCircle, Loader2, Shield, Lock } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import FrontendLayout from '../components/FrontendLayout';
import axios from 'axios';

interface FormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  email: string;
}

interface FormErrors {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  email?: string;
}

const planDetails = {
  pro: {
    name: 'Pro',
    price: 19.99,
    features: [
      '1000 tokens al mes',
      'Acceso a modelos avanzados',
      'Soporte prioritario',
      '5 conexiones de base de datos',
      'Chat avanzado',
      'Exportación de datos',
      'Historial completo'
    ]
  },
  ultra: {
    name: 'Ultra',
    price: 99.99,
    features: [
      'Consultas ilimitadas',
      'Todos los modelos disponibles',
      'Soporte 24/7',
      'Conexiones ilimitadas',
      'Chat ultra avanzado',
      'Exportación avanzada',
      'API personalizada',
      'Análisis avanzado',
      'Integraciones premium'
    ]
  }
};

export default function Checkout() {
  const { chatData } = useChat();
  const { userInfo } = chatData;
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [formData, setFormData] = useState<FormData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    email: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'ultra'>('pro');

  // Get plan from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    if (plan === 'ultra') {
      setSelectedPlan('ultra');
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar número de tarjeta (formato básico)
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }

    // Validar titular
    if (formData.cardHolder.trim().length < 3) {
      newErrors.cardHolder = 'Nombre del titular es requerido';
    }

    // Validar fecha de expiración
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiryDate = 'Formato MM/YY requerido';
    }

    // Validar CVV
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'CVV debe tener 3-4 dígitos';
    }

    // Validar email
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setStep('processing');

    // Simular proceso de pago
    setTimeout(async () => {
      try {
        const response = await axios.post('/api/user/upgrade-to-premium', {}, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
        });

        if (response.status === 200) {
          setStep('success');
          setTimeout(() => {
            router.visit('/chat');
          }, 2000);
        } else {
          throw new Error('Error en el upgrade');
        }
      } catch (error) {
        console.error('Error:', error);
        if (axios.isAxiosError(error)) {
          console.error('Error de Axios:', error.response?.data);
          console.error('Status:', error.response?.status);
        }
        setStep('checkout');
      }
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const plan = planDetails[selectedPlan];

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  return (
    <>
      <Head title={`Checkout - ${plan.name} Plan`} />
      
      <FrontendLayout userInfo={userInfo} activePage="checkout" onLogout={handleLogout}>
        {/* Back to Pricing Link */}
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            href="/pricing"
            className="inline-flex items-center transition-colors"
            style={{ color: 'var(--techwave-body-color)' }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Pricing
          </Link>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {step === 'checkout' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Order Summary */}
              <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--techwave-heading-color)' }}>Resumen del Pedido</h2>
                
                <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>{plan.name} Plan</h3>
                    <span className="text-2xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>${plan.price}</span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: 'var(--techwave-body-color)' }}>Facturación mensual</p>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--techwave-heading-color)' }} />
                        <span className="text-sm" style={{ color: 'var(--techwave-heading-color)' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6" style={{ borderTop: '1px solid var(--techwave-border-color)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: 'var(--techwave-body-color)' }}>Subtotal</span>
                    <span style={{ color: 'var(--techwave-heading-color)' }}>${plan.price}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: 'var(--techwave-body-color)' }}>Impuestos</span>
                    <span style={{ color: 'var(--techwave-heading-color)' }}>$0.00</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span style={{ color: 'var(--techwave-heading-color)' }}>Total</span>
                    <span style={{ color: 'var(--techwave-heading-color)' }}>${plan.price}</span>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--techwave-border-color)' }}>
                  <div className="flex items-center justify-center space-x-6" style={{ color: 'var(--techwave-body-color)' }}>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      <span className="text-xs">SSL Seguro</span>
                    </div>
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      <span className="text-xs">Pago Seguro</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--techwave-heading-color)' }}>Información de Pago</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--techwave-some-a-bg-color)',
                        borderColor: errors.email ? '#ef4444' : 'var(--techwave-border-color)',
                        color: 'var(--techwave-heading-color)'
                      }}
                    />
                    {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                      Número de Tarjeta
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-5 w-5" style={{ color: 'var(--techwave-body-color)' }} />
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.cardNumber ? 'border-red-500' : ''
                        }`}
                        style={{
                          backgroundColor: 'var(--techwave-some-a-bg-color)',
                          borderColor: errors.cardNumber ? '#ef4444' : 'var(--techwave-border-color)',
                          color: 'var(--techwave-heading-color)'
                        }}
                        maxLength={19}
                      />
                    </div>
                    {errors.cardNumber && <p className="text-sm text-red-400 mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                        Titular
                      </label>
                      <input
                        type="text"
                        placeholder="NOMBRE APELLIDO"
                        value={formData.cardHolder}
                        onChange={(e) => setFormData({...formData, cardHolder: e.target.value.toUpperCase()})}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.cardHolder ? 'border-red-500' : ''
                        }`}
                        style={{
                          backgroundColor: 'var(--techwave-some-a-bg-color)',
                          borderColor: errors.cardHolder ? '#ef4444' : 'var(--techwave-border-color)',
                          color: 'var(--techwave-heading-color)'
                        }}
                      />
                      {errors.cardHolder && <p className="text-sm text-red-400 mt-1">{errors.cardHolder}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                        Expiración
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: formatExpiryDate(e.target.value)})}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.expiryDate ? 'border-red-500' : ''
                        }`}
                        style={{
                          backgroundColor: 'var(--techwave-some-a-bg-color)',
                          borderColor: errors.expiryDate ? '#ef4444' : 'var(--techwave-border-color)',
                          color: 'var(--techwave-heading-color)'
                        }}
                        maxLength={5}
                      />
                      {errors.expiryDate && <p className="text-sm text-red-400 mt-1">{errors.expiryDate}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.cvv ? 'border-red-500' : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--techwave-some-a-bg-color)',
                        borderColor: errors.cvv ? '#ef4444' : 'var(--techwave-border-color)',
                        color: 'var(--techwave-heading-color)'
                      }}
                      maxLength={4}
                    />
                    {errors.cvv && <p className="text-sm text-red-400 mt-1">{errors.cvv}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                    style={{
                      backgroundColor: 'var(--techwave-some-a-bg-color)',
                      color: 'var(--techwave-heading-color)',
                      border: '1px solid var(--techwave-border-color)'
                    }}
                  >
                    Pagar ${plan.price}
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-24">
              <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6" style={{ color: 'var(--techwave-heading-color)' }} />
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>Procesando pago...</h2>
              <p className="max-w-md mx-auto" style={{ color: 'var(--techwave-body-color)' }}>
                Por favor espera mientras procesamos tu pago de forma segura. 
                Esto puede tomar unos segundos.
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-24">
              <div className="rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                <CheckCircle className="h-12 w-12" style={{ color: 'var(--techwave-heading-color)' }} />
              </div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>¡Pago exitoso!</h2>
              <p className="max-w-md mx-auto mb-8" style={{ color: 'var(--techwave-body-color)' }}>
                Tu suscripción {plan.name} ha sido activada. 
                Serás redirigido al chat en unos segundos.
              </p>
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" style={{ color: 'var(--techwave-heading-color)' }} />
                <span style={{ color: 'var(--techwave-body-color)' }}>Redirigiendo...</span>
              </div>
            </div>
          )}
        </div>
      </FrontendLayout>
    </>
  );
} 