import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Mail, Phone, MapPin, MessageSquare, Send, Clock, Users, Globe } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import FrontendLayout from '../components/FrontendLayout';

export default function Contact() {
  const { chatData } = useChat();
  const { userInfo } = chatData;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '', priority: 'normal' });
      
      // Resetear mensaje de éxito después de 5 segundos
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@gatherlake.ai',
      description: 'Respuesta en 24 horas'
    },
    {
      icon: Phone,
      title: 'Teléfono',
      value: '+1 (555) 123-4567',
      description: 'Lun-Vie 9AM-6PM EST'
    },
    {
      icon: MapPin,
      title: 'Oficina',
      value: 'San Francisco, CA',
      description: 'Estados Unidos'
    }
  ];

  const supportChannels = [
    {
      icon: MessageSquare,
      title: 'Chat en Vivo',
      description: 'Soporte inmediato disponible 24/7 para usuarios premium',
      available: true
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Tickets de soporte con respuesta garantizada',
      available: true
    },
    {
      icon: Users,
      title: 'Comunidad',
      description: 'Foro de usuarios y documentación colaborativa',
      available: true
    },
    {
      icon: Globe,
      title: 'Webinars',
      description: 'Sesiones de capacitación semanales',
      available: userInfo.plan === 'Premium'
    }
  ];

  return (
    <>
      <Head title="Contacto - GatherLake AI" />
      <FrontendLayout userInfo={userInfo} activePage="contact">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              <MessageSquare className="h-10 w-10" style={{ color: 'var(--techwave-heading-color)' }} />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
              Contáctanos
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--techwave-body-color)' }}>
              ¿Tienes preguntas, necesitas ayuda o quieres saber más sobre GatherLake AI? Nuestro equipo está aquí para ayudarte.
            </p>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-8 p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              <p className="text-lg font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                ¡Mensaje enviado exitosamente! Te responderemos pronto.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--techwave-heading-color)' }}>
                Envíanos un Mensaje
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'var(--techwave-some-a-bg-color)',
                        borderColor: 'var(--techwave-border-color)',
                        color: 'var(--techwave-heading-color)'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'var(--techwave-some-a-bg-color)',
                        borderColor: 'var(--techwave-border-color)',
                        color: 'var(--techwave-heading-color)'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Asunto *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--techwave-some-a-bg-color)',
                      borderColor: 'var(--techwave-border-color)',
                      color: 'var(--techwave-heading-color)'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Prioridad
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--techwave-some-a-bg-color)',
                      borderColor: 'var(--techwave-border-color)',
                      color: 'var(--techwave-heading-color)'
                    }}
                  >
                    <option value="low">Baja</option>
                    <option value="normal">Normal</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Mensaje *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none"
                    style={{
                      backgroundColor: 'var(--techwave-some-a-bg-color)',
                      borderColor: 'var(--techwave-border-color)',
                      color: 'var(--techwave-heading-color)'
                    }}
                    placeholder="Describe tu consulta o problema..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--techwave-some-a-bg-color)',
                    color: 'var(--techwave-heading-color)',
                    border: '1px solid var(--techwave-border-color)'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" style={{ borderColor: 'var(--techwave-heading-color)' }}></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--techwave-heading-color)' }}>
                Información de Contacto
              </h2>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <info.icon className="h-6 w-6" style={{ color: 'var(--techwave-heading-color)' }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--techwave-heading-color)' }}>
                        {info.title}
                      </h3>
                      <p className="text-lg font-medium mb-1" style={{ color: 'var(--techwave-heading-color)' }}>
                        {info.value}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Support Channels */}
              <div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                  Canales de Soporte
                </h3>
                <div className="space-y-3">
                  {supportChannels.map((channel) => (
                    <div key={channel.title} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <div className="flex items-center">
                        <channel.icon className="h-5 w-5 mr-3" style={{ color: 'var(--techwave-heading-color)' }} />
                        <div>
                          <h4 className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                            {channel.title}
                          </h4>
                          <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                            {channel.description}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        channel.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {channel.available ? 'Disponible' : 'Premium'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-16 text-center">
            <div 
              className="rounded-xl p-8"
              style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
            >
              <Clock className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--techwave-heading-color)' }} />
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                Tiempos de Respuesta
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Usuarios Gratuitos
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                    24-48 horas
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Usuarios Premium
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                    Menos de 4 horas
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Usuarios Ultra
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                    Soporte 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FrontendLayout>
    </>
  );
} 