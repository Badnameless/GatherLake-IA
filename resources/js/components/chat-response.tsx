import React from 'react';
import { ChatMessage } from '../types/chat';
import { Database, ArrowRight, CheckCircle, Settings, Link, AlertTriangle, CheckCircle2, Table, FileText } from 'lucide-react';

interface ChatResponseProps {
  message: ChatMessage;
}

export default function ChatResponse({ message }: ChatResponseProps) {
  // Si es un mensaje especial, renderizar como card visual
  if (message.isSpecialMessage) {
    return (
      <div className="mb-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--techwave-main-color)' }}>
            <Database className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              {/* Header */}
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'var(--techwave-error-color)' }}>
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>
                    No hay conexiones de base de datos configuradas
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                    Para usar el asistente SQL, necesitas crear al menos una conexión
                  </p>
                </div>
              </div>

              {/* Pasos */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center" style={{ color: 'var(--techwave-heading-color)' }}>
                  <Settings className="w-4 h-4 mr-2" style={{ color: 'var(--techwave-main-color)' }} />
                  Pasos para configurar:
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3" style={{ backgroundColor: 'var(--techwave-main-color)', color: 'white' }}>1</span>
                    <span style={{ color: 'var(--techwave-body-color)' }}>Ve a <strong>Conexiones</strong> en el sidebar izquierdo</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3" style={{ backgroundColor: 'var(--techwave-main-color)', color: 'white' }}>2</span>
                    <span style={{ color: 'var(--techwave-body-color)' }}>Haz clic en <strong>"Nueva Conexión"</strong></span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3" style={{ backgroundColor: 'var(--techwave-main-color)', color: 'white' }}>3</span>
                    <span style={{ color: 'var(--techwave-body-color)' }}>Configura los datos de tu base de datos</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3" style={{ backgroundColor: 'var(--techwave-main-color)', color: 'white' }}>4</span>
                    <span style={{ color: 'var(--techwave-body-color)' }}>Activa la conexión una vez configurada</span>
                  </div>
                </div>
              </div>

              {/* Detalles de configuración */}
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                <h5 className="font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>Datos requeridos:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div style={{ color: 'var(--techwave-body-color)' }}>• Tipo de base de datos</div>
                  <div style={{ color: 'var(--techwave-body-color)' }}>• Host y puerto</div>
                  <div style={{ color: 'var(--techwave-body-color)' }}>• Nombre de la base de datos</div>
                  <div style={{ color: 'var(--techwave-body-color)' }}>• Usuario y contraseña</div>
                </div>
              </div>

              {/* Después de configurar */}
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                <h5 className="font-medium mb-2 flex items-center" style={{ color: 'var(--techwave-success-color)' }}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Después de configurar:
                </h5>
                <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                  Podrás hacer consultas SQL en lenguaje natural y el asistente te ayudará a generar consultas automáticamente.
                </p>
              </div>

              {/* Acceso directo */}
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--techwave-main-color)' }}>
                <div className="flex items-center">
                  <Link className="w-4 h-4 mr-2 text-white" />
                  <span className="text-white font-medium">Acceso directo a Conexiones</span>
                </div>
                <a 
                  href="/connections" 
                  className="flex items-center px-4 py-2 rounded-lg transition-all hover:scale-105"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                >
                  <span className="mr-2">Ir a Conexiones</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Manejar respuestas con datos estructurados
  if (message.responseData) {
    const { type, sql, data, affectedRows, affectedRecords, affectedCount } = message.responseData;

    if (type === 'select' && data && Array.isArray(data)) {
      // Renderizar tabla para consultas SELECT
      const columns = data.length > 0 ? Object.keys(data[0]) : [];
      
      return (
        <div className="mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--techwave-main-color)' }}>
              <Table className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                {/* Header */}
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'var(--techwave-success-color)' }}>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>
                      Consulta SELECT ejecutada exitosamente
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                      {data.length} registros encontrados
                    </p>
                  </div>
                </div>

                {/* SQL generado */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 flex items-center" style={{ color: 'var(--techwave-heading-color)' }}>
                    <FileText className="w-4 h-4 mr-2" style={{ color: 'var(--techwave-main-color)' }} />
                    SQL generado:
                  </h4>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                    <code className="text-sm" style={{ color: 'var(--techwave-main-color)' }}>{sql}</code>
                  </div>
                </div>

                {/* Tabla de resultados */}
                <div className="mb-4">
                  <h4 className="font-medium mb-3" style={{ color: 'var(--techwave-heading-color)' }}>
                    Resultados:
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse" style={{ border: '1px solid var(--techwave-border-color)' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                          {columns.map((column) => (
                            <th 
                              key={column}
                              className="px-4 py-3 text-left text-sm font-medium border"
                              style={{ borderColor: 'var(--techwave-border-color)', color: 'var(--techwave-heading-color)' }}
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((row, rowIndex) => (
                          <tr 
                            key={rowIndex}
                            style={{ 
                              backgroundColor: rowIndex % 2 === 0 ? 'var(--techwave-some-r-bg-color)' : 'var(--techwave-some-a-bg-color)',
                              borderColor: 'var(--techwave-border-color)'
                            }}
                          >
                            {columns.map((column) => (
                              <td 
                                key={column}
                                className="px-4 py-3 text-sm border"
                                style={{ 
                                  borderColor: 'var(--techwave-border-color)', 
                                  color: 'var(--techwave-body-color)' 
                                }}
                              >
                                {row[column] !== null && row[column] !== undefined ? String(row[column]) : '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'pending') {
      // Renderizar confirmación para UPDATE/DELETE
      return (
        <div className="mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--techwave-warning-color)' }}>
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
                {/* Header */}
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'var(--techwave-warning-color)' }}>
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>
                      Consulta {type.toUpperCase()} que requiere confirmación
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                      {affectedCount} registros se verán afectados
                    </p>
                  </div>
                </div>

                {/* SQL generado */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 flex items-center" style={{ color: 'var(--techwave-heading-color)' }}>
                    <FileText className="w-4 h-4 mr-2" style={{ color: 'var(--techwave-main-color)' }} />
                    SQL generado:
                  </h4>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                    <code className="text-sm" style={{ color: 'var(--techwave-main-color)' }}>{sql}</code>
                  </div>
                </div>

                {/* Registros afectados */}
                {affectedRecords && affectedRecords.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3" style={{ color: 'var(--techwave-heading-color)' }}>
                      Registros que se verán afectados:
                    </h4>
                    <div className="space-y-2">
                      {affectedRecords.map((record, index) => (
                        <div 
                          key={index}
                          className="p-3 rounded-lg text-sm"
                          style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}
                        >
                          <span className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                            {index + 1}.
                          </span>
                          <span className="ml-2" style={{ color: 'var(--techwave-body-color)' }}>
                            {JSON.stringify(record, null, 2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instrucciones */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--techwave-main-color)' }}>
                  <div className="text-white text-center">
                    <p className="font-medium mb-2">Para confirmar:</p>
                    <p className="text-sm mb-3">Escribe "sí", "confirmar" o "aceptar"</p>
                    <p className="font-medium mb-2">Para cancelar:</p>
                    <p className="text-sm">Escribe "no" o "cancelar"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Para otras consultas (INSERT, UPDATE, DELETE)
    return (
      <div className="mb-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--techwave-success-color)' }}>
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              {/* Header */}
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'var(--techwave-success-color)' }}>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>
                    Consulta {type.toUpperCase()} ejecutada exitosamente
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                    {affectedRows || 0} filas afectadas
                  </p>
                </div>
              </div>

              {/* SQL generado */}
              <div className="mb-4">
                <h4 className="font-medium mb-2 flex items-center" style={{ color: 'var(--techwave-heading-color)' }}>
                  <FileText className="w-4 h-4 mr-2" style={{ color: 'var(--techwave-main-color)' }} />
                  SQL ejecutado:
                </h4>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                  <code className="text-sm" style={{ color: 'var(--techwave-main-color)' }}>{sql}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado normal para mensajes del bot
  if (message.author === 'bot') {
    return (
      <div className="mb-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--techwave-main-color)' }}>
            <Database className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              <div className="prose prose-sm max-w-none" style={{ color: 'var(--techwave-body-color)' }}>
                {message.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado para mensajes del usuario
  return (
    <div className="mb-6">
      <div className="flex items-start space-x-3 justify-end">
        <div className="flex-1 min-w-0 text-right">
          <div className="rounded-lg p-4 inline-block" style={{ backgroundColor: 'var(--techwave-main-color)', color: 'white' }}>
            <div className="prose prose-sm max-w-none text-white">
              {message.content}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
            {message.author === 'user' ? 'U' : 'B'}
          </span>
        </div>
      </div>
    </div>
  );
} 