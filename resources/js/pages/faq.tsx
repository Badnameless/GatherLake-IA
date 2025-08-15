import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, MessageSquare, Database, Shield, CreditCard, Users } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import FrontendLayout from '../components/FrontendLayout';

export default function FAQ() {
  const { chatData } = useChat();
  const { userInfo } = chatData;
  
  const [openCategories, setOpenCategories] = useState<string[]>(['general']);

  const faqData = {
    general: {
      title: 'General',
      icon: HelpCircle,
      questions: [
        {
          question: '¿Qué es GatherLake AI?',
          answer: 'GatherLake AI es una plataforma de inteligencia artificial que permite convertir consultas en lenguaje natural a SQL y interactuar con bases de datos de manera inteligente. Nuestro asistente AI puede entender preguntas complejas y generar consultas SQL precisas.'
        },
        {
          question: '¿Cómo funciona el sistema de tokens?',
          answer: 'Los tokens son unidades de uso que se consumen cada vez que realizas una consulta o usas el chat. El plan gratuito incluye un número limitado de tokens mensuales, mientras que los planes premium ofrecen más tokens o consultas ilimitadas.'
        },
        {
          question: '¿Qué bases de datos son compatibles?',
          answer: 'GatherLake AI es compatible con las principales bases de datos relacionales como MySQL, PostgreSQL, SQL Server, Oracle, SQLite y más. También soportamos conexiones a través de APIs y servicios en la nube.'
        }
      ]
    },
    technical: {
      title: 'Técnico',
      icon: Database,
      questions: [
        {
          question: '¿Cómo se conecta a mi base de datos?',
          answer: 'Para conectar tu base de datos, necesitas proporcionar la información de conexión (host, puerto, nombre de base de datos, usuario y contraseña). Todas las conexiones se encriptan y se almacenan de forma segura.'
        },
        {
          question: '¿Es seguro conectar mi base de datos?',
          answer: 'Sí, la seguridad es nuestra prioridad. Todas las conexiones se realizan a través de conexiones encriptadas SSL/TLS. No almacenamos datos de tu base de datos, solo los metadatos necesarios para las consultas.'
        },
        {
          question: '¿Puedo usar mi propia API key de OpenAI?',
          answer: 'Actualmente no soportamos API keys personalizadas. Utilizamos nuestros propios modelos optimizados para consultas de bases de datos, lo que nos permite ofrecer mejor rendimiento y costos más bajos.'
        }
      ]
    },
    billing: {
      title: 'Facturación',
      icon: CreditCard,
      questions: [
        {
          question: '¿Cómo funciona la facturación?',
          answer: 'La facturación es mensual y se basa en el plan que elijas. Puedes cambiar o cancelar tu plan en cualquier momento. Los cambios se aplican al siguiente ciclo de facturación.'
        },
        {
          question: '¿Hay un período de prueba gratuito?',
          answer: 'Sí, ofrecemos un período de prueba gratuito de 7 días para todos nuestros planes premium. Durante este tiempo puedes probar todas las funcionalidades sin compromiso.'
        },
        {
          question: '¿Qué pasa si me quedo sin tokens?',
          answer: 'Si te quedas sin tokens, puedes comprar tokens adicionales o actualizar a un plan superior. También puedes esperar hasta el siguiente mes cuando se renueven tus tokens.'
        }
      ]
    },
    support: {
      title: 'Soporte',
      icon: MessageSquare,
      questions: [
        {
          question: '¿Cómo puedo obtener ayuda técnica?',
          answer: 'Ofrecemos múltiples canales de soporte: chat en vivo, tickets de soporte, documentación detallada y una comunidad activa de usuarios. Los usuarios premium tienen acceso prioritario al soporte.'
        },
        {
          question: '¿Cuál es el tiempo de respuesta del soporte?',
          answer: 'Para usuarios gratuitos, el tiempo de respuesta típico es de 24-48 horas. Los usuarios premium reciben respuesta en menos de 4 horas, y los usuarios Ultra tienen soporte 24/7.'
        },
        {
          question: '¿Ofrecen capacitación o onboarding?',
          answer: 'Sí, ofrecemos sesiones de onboarding gratuitas para nuevos usuarios y capacitación personalizada para equipos. También tenemos webinars regulares y tutoriales en video.'
        }
      ]
    }
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const isCategoryOpen = (category: string) => openCategories.includes(category);

  return (
    <>
      <Head title="FAQ - GatherLake AI" />
      <FrontendLayout userInfo={userInfo} activePage="faq">
        {/* Back to Home Link */}
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            href="/"
            className="inline-flex items-center transition-colors"
            style={{ color: 'var(--techwave-body-color)' }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Chat
          </Link>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              <HelpCircle className="h-10 w-10" style={{ color: 'var(--techwave-heading-color)' }} />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
              Preguntas Frecuentes
            </h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--techwave-body-color)' }}>
              Encuentra respuestas a las preguntas más comunes sobre GatherLake AI. Si no encuentras lo que buscas, no dudes en contactarnos.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-6">
            {Object.entries(faqData).map(([key, category]) => (
              <div 
                key={key}
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
              >
                <button
                  onClick={() => toggleCategory(key)}
                  className="w-full p-6 flex items-center justify-between hover:bg-opacity-80 transition-colors"
                  style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}
                >
                  <div className="flex items-center">
                    <category.icon className="h-6 w-6 mr-3" style={{ color: 'var(--techwave-heading-color)' }} />
                    <h2 className="text-xl font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>
                      {category.title}
                    </h2>
                  </div>
                  {isCategoryOpen(key) ? (
                    <ChevronUp className="h-5 w-5" style={{ color: 'var(--techwave-heading-color)' }} />
                  ) : (
                    <ChevronDown className="h-5 w-5" style={{ color: 'var(--techwave-heading-color)' }} />
                  )}
                </button>
                
                {isCategoryOpen(key) && (
                  <div className="p-6 space-y-6">
                    {category.questions.map((item, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0" style={{ borderColor: 'var(--techwave-border-color)' }}>
                        <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--techwave-heading-color)' }}>
                          {item.question}
                        </h3>
                        <p className="text-base leading-relaxed" style={{ color: 'var(--techwave-body-color)' }}>
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <div 
              className="rounded-xl p-8"
              style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
            >
              <MessageSquare className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--techwave-heading-color)' }} />
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                ¿No encontraste tu respuesta?
              </h2>
              <p className="text-lg mb-6" style={{ color: 'var(--techwave-body-color)' }}>
                Nuestro equipo de soporte está aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', color: 'var(--techwave-heading-color)' }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contactar Soporte
                </a>
                <a 
                  href="/documentation"
                  className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors border"
                  style={{ borderColor: 'var(--techwave-border-color)', color: 'var(--techwave-heading-color)' }}
                >
                  Ver Documentación
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-16">
            <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: 'var(--techwave-heading-color)' }}>
              Enlaces Útiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a 
                href="/pricing"
                className="p-4 rounded-lg text-center transition-colors hover:scale-105"
                style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
              >
                <CreditCard className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--techwave-heading-color)' }} />
                <span className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>Planes y Precios</span>
              </a>
              <a 
                href="/documentation"
                className="p-4 rounded-lg text-center transition-colors hover:scale-105"
                style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
              >
                <HelpCircle className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--techwave-heading-color)' }} />
                <span className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>Documentación</span>
              </a>
              <a 
                href="/contact"
                className="p-4 rounded-lg text-center transition-colors hover:scale-105"
                style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
              >
                <Users className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--techwave-heading-color)' }} />
                <span className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>Contacto</span>
              </a>
            </div>
          </div>
        </div>
      </FrontendLayout>
    </>
  );
} 