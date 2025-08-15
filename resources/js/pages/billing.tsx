import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useChat } from '../hooks/useChat';
import FrontendLayout from '../components/FrontendLayout';
import { CreditCard, Download, Calendar, DollarSign, CheckCircle } from 'lucide-react';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  email?: string;
  isDefault: boolean;
}

export default function Billing() {
  const { chatData } = useChat();
  const { userInfo } = chatData;
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payment-methods'>('overview');

  const handleLogout = () => {
    router.post('/logout');
  };

  // Mock data - en producción esto vendría de la API
  const invoices: Invoice[] = [
    {
      id: 'INV-001',
      date: '2024-01-15',
      amount: 19.99,
      status: 'paid',
      description: 'Plan Pro - Enero 2024'
    },
    {
      id: 'INV-002',
      date: '2024-02-15',
      amount: 19.99,
      status: 'paid',
      description: 'Plan Pro - Febrero 2024'
    },
    {
      id: 'INV-003',
      date: '2024-03-15',
      amount: 19.99,
      status: 'pending',
      description: 'Plan Pro - Marzo 2024'
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'pm_1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      isDefault: true
    },
    {
      id: 'pm_2',
      type: 'paypal',
      email: 'user@example.com',
      isDefault: false
    }
  ];

  const tabs = [
    { id: 'overview' as const, name: 'Resumen', icon: '📊' },
    { id: 'invoices' as const, name: 'Facturas', icon: '📄' },
    { id: 'payment-methods' as const, name: 'Métodos de Pago', icon: '💳' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-500 bg-green-100';
      case 'pending':
        return 'text-yellow-500 bg-yellow-100';
      case 'failed':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pagado';
      case 'pending':
        return 'Pendiente';
      case 'failed':
        return 'Fallido';
      default:
        return 'Desconocido';
    }
  };

  return (
    <>
      <Head title="Billing - GatherLake AI" />
      
      <FrontendLayout userInfo={userInfo} activePage="billing" onLogout={handleLogout}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 pt-[40px]">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>
              Facturación
            </h1>
            <p className="mt-2" style={{ color: 'var(--techwave-body-color)' }}>
              Gestiona tu suscripción, facturas y métodos de pago
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b mb-8" style={{ borderColor: 'var(--techwave-border-color)' }}>
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{
                    color: activeTab === tab.id 
                      ? 'var(--techwave-main-color)' 
                      : 'var(--techwave-body-color)',
                    borderColor: activeTab === tab.id 
                      ? 'var(--techwave-main-color)' 
                      : 'transparent'
                  }}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Current Plan */}
                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                    Plan Actual
                  </h3>
                  <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>
                          {userInfo.plan} Plan
                        </h4>
                        <p className="text-sm mt-1" style={{ color: 'var(--techwave-body-color)' }}>
                          Facturación mensual
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>
                          ${userInfo.plan === 'Free' ? '0' : userInfo.plan === 'Pro' ? '19.99' : '99.99'}
                        </div>
                        <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                          por mes
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--techwave-border-color)' }}>
                      <Link
                        href="/pricing"
                        className="inline-flex items-center px-4 py-2 rounded-lg transition-colors"
                        style={{ backgroundColor: 'var(--techwave-main-color)', color: 'white' }}
                      >
                        Cambiar Plan
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Billing Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                    Resumen de Facturación
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                      <div className="flex items-center">
                        <DollarSign className="h-8 w-8 mr-3" style={{ color: 'var(--techwave-main-color)' }} />
                        <div>
                          <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>Total Gastado</p>
                          <p className="text-xl font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>$39.98</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                      <div className="flex items-center">
                        <Calendar className="h-8 w-8 mr-3" style={{ color: 'var(--techwave-main-color)' }} />
                        <div>
                          <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>Próxima Facturación</p>
                          <p className="text-xl font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>15 Mar</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                      <div className="flex items-center">
                        <CheckCircle className="h-8 w-8 mr-3" style={{ color: 'var(--techwave-main-color)' }} />
                        <div>
                          <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>Estado</p>
                          <p className="text-xl font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>Activo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div>
                <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--techwave-heading-color)' }}>
                  Historial de Facturas
                </h3>
                
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                            {invoice.description}
                          </h4>
                          <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                            {invoice.id} • {invoice.date}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {getStatusText(invoice.status)}
                        </span>
                        <span className="font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>
                          ${invoice.amount}
                        </span>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <Download className="h-4 w-4" style={{ color: 'var(--techwave-body-color)' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payment-methods' && (
              <div>
                <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--techwave-heading-color)' }}>
                  Métodos de Pago
                </h3>
                
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                      <div className="flex items-center space-x-4">
                        <CreditCard className="h-6 w-6" style={{ color: 'var(--techwave-main-color)' }} />
                        <div>
                          <h4 className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                            {method.type === 'card' ? `${method.brand} •••• ${method.last4}` : `PayPal (${method.email})`}
                          </h4>
                          {method.isDefault && (
                            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--techwave-main-color)', color: 'white' }}>
                              Predeterminado
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!method.isDefault && (
                          <button className="px-3 py-1 text-sm rounded-lg transition-colors" style={{ backgroundColor: 'var(--techwave-main-color)', color: 'white' }}>
                            Hacer Predeterminado
                          </button>
                        )}
                        <button className="px-3 py-1 text-sm rounded-lg transition-colors border" style={{ borderColor: 'var(--techwave-border-color)', color: 'var(--techwave-body-color)' }}>
                          Editar
                        </button>
                        <button className="px-3 py-1 text-sm rounded-lg transition-colors border" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full p-4 border-2 border-dashed rounded-lg text-center transition-colors hover:border-solid"
                          style={{ borderColor: 'var(--techwave-border-color)', color: 'var(--techwave-body-color)' }}>
                    <CreditCard className="h-8 w-8 mx-auto mb-2" />
                    <span className="font-medium">Agregar Método de Pago</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </FrontendLayout>
    </>
  );
} 