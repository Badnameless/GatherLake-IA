import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Check, Star, Zap, Crown, ChevronDown } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import FrontendLayout from '../components/FrontendLayout';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'para siempre',
    description: 'Perfecto para empezar',
    features: [
      '200 tokens al día',
      'Acceso básico a modelos',
      'Soporte por email',
      '1 conexión de base de datos',
      'Chat básico'
    ],
    buttonText: 'Plan Actual',
    buttonVariant: 'outline' as const,
    popular: false,
    icon: <Zap className="h-6 w-6" />
  },
  {
    name: 'Pro',
    price: '$19.99',
    period: 'por mes',
    description: 'Para usuarios profesionales',
    features: [
      '1000 tokens al mes',
      'Acceso a modelos avanzados',
      'Soporte prioritario',
      '5 conexiones de base de datos',
      'Chat avanzado',
      'Exportación de datos',
      'Historial completo'
    ],
    buttonText: 'Seleccionar Pro',
    buttonVariant: 'default' as const,
    popular: true,
    icon: <Star className="h-6 w-6" />
  },
  {
    name: 'Ultra',
    price: '$99.99',
    period: 'por mes',
    description: 'Para equipos y empresas',
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
    ],
    buttonText: 'Seleccionar Ultra',
    buttonVariant: 'default' as const,
    popular: false,
    icon: <Crown className="h-6 w-6" />
  }
];

export default function Pricing() {
  const { chatData } = useChat();
  const { userInfo } = chatData;
  
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: '¿Puedo cambiar de plan en cualquier momento?',
      answer: 'Sí, puedes actualizar o degradar tu plan en cualquier momento desde tu panel de control.'
    },
    {
      question: '¿Los tokens se renuevan automáticamente?',
      answer: 'Sí, los tokens se renuevan automáticamente todos los dias a las 20:00 UTC.'
    },
    {
      question: '¿Ofrecen reembolso?',
      answer: 'Ofrecemos reembolso completo dentro de los primeros 30 días de tu suscripción.'
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos todas las tarjetas de crédito principales: Visa, Mastercard, American Express.'
    }
  ];

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  return (
    <>
      <Head title="Pricing - GatherLake AI" />
      
      <FrontendLayout userInfo={userInfo} activePage="pricing" onLogout={handleLogout}>
        {/* Pricing Header */}
        <div className="relative overflow-hidden" style={{ backgroundColor: 'var(--techwave-header-bg-color)', marginBottom: '2rem' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(270deg, var(--techwave-main-color1), var(--techwave-main-color2), var(--techwave-main-color1), var(--techwave-main-color2))', opacity: '0.1' }}></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--techwave-heading-color)' }}>
                Elige tu plan
              </h1>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--techwave-body-color)' }}>
                Encuentra el plan perfecto para potenciar tu productividad con IA. 
                Desde principiantes hasta equipos empresariales.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 mt-[100px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  plan.popular
                    ? 'border-2'
                    : 'border'
                }`}
                style={{
                  backgroundColor: plan.popular ? 'var(--techwave-some-a-bg-color)' : 'var(--techwave-some-r-bg-color)',
                  borderColor: plan.popular ? 'var(--techwave-border-color)' : 'var(--techwave-border-color)',
                  color: 'var(--techwave-heading-color)'
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', color: 'var(--techwave-heading-color)', border: '1px solid var(--techwave-border-color)' }}>
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
                    backgroundColor: plan.popular ? 'var(--techwave-site-bg-color)' : 'var(--techwave-some-a-bg-color)',
                    color: 'var(--techwave-heading-color)',
                    border: plan.popular ? '2px solid var(--techwave-border-color)' : 'none'
                  }}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm mb-4" style={{ opacity: 0.8 }}>{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm ml-1" style={{ opacity: 0.8 }}>{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--techwave-heading-color)' }} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  {plan.name === 'Free' ? (
                    <button
                      className="w-full px-6 py-3 rounded-lg cursor-not-allowed"
                      style={{
                        border: '1px solid var(--techwave-border-color)',
                        color: 'var(--techwave-body-color)',
                        backgroundColor: 'var(--techwave-some-r-bg-color)'
                      }}
                      disabled
                    >
                      {plan.buttonText}
                    </button>
                  ) : (
                    <Link
                      href={`/checkout?plan=${plan.name.toLowerCase()}`}
                      className="inline-block w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: 'var(--techwave-site-bg-color)',
                        color: 'var(--techwave-heading-color)',
                        border: '2px solid var(--techwave-border-color)',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {plan.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--techwave-heading-color)' }}>
              Preguntas Frecuentes
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-4">
                {faqs.map((faq, index) => (
                  <div 
                    key={index}
                    className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === index 
                        ? 'scale-[1.01]' 
                        : 'hover:scale-[1.005]'
                    }`}
                    style={{ 
                      background: openFaq === index 
                        ? 'linear-gradient(135deg, var(--techwave-some-a-bg-color) 0%, var(--techwave-some-r-bg-color) 100%)'
                        : 'var(--techwave-some-r-bg-color)',
                      borderRadius: '12px',
                      border: '1px solid var(--techwave-border-color)',
                      boxShadow: openFaq === index 
                        ? '0 10px 25px -5px rgba(0, 0, 0, 0.2)' 
                        : '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <button
                      className="relative w-full px-6 py-5 text-left flex items-center justify-between transition-all duration-300"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div 
                            className={`flex-shrink-0 w-2 h-2 rounded-full transition-all duration-300 ${
                              openFaq === index 
                                ? 'bg-gray-300 scale-125' 
                                : 'bg-gray-500'
                            }`}
                          />
                          <h3 className={`text-lg font-semibold transition-all duration-300 ${
                            openFaq === index 
                              ? 'text-gray-200' 
                              : 'text-gray-300'
                          }`}>
                            {faq.question}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-shrink-0">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            openFaq === index 
                              ? 'bg-gray-700 bg-opacity-60' 
                              : 'bg-gray-700 bg-opacity-30 hover:bg-opacity-50'
                          }`}
                        >
                          <ChevronDown 
                            className={`h-4 w-4 transition-all duration-300 ${
                              openFaq === index ? 'rotate-180 text-gray-200' : 'text-gray-400'
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                    
                    <div 
                      className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
                        openFaq === index ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 pb-5">
                        <div className="pt-3 border-t border-gray-600 border-opacity-30">
                          <p className="text-base leading-relaxed text-gray-300">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FrontendLayout>
    </>
  );
} 