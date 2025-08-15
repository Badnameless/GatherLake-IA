import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Database, Code, Maximize2 } from 'lucide-react';
import { ChatMessage } from '../types/chat';

interface ChatResponseProps {
  message?: ChatMessage; // Mensaje completo del chat
  type?: 'select' | 'insert' | 'update' | 'delete' | 'pending';
  sql?: string;
  data?: Record<string, unknown>[];
  affectedRows?: number;
  affectedRecords?: Record<string, unknown>[];
  affectedCount?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
  isConfirming?: boolean;
  isCompleted?: boolean;
}

export default function ChatResponse({
  message,
  type,
  sql,
  data,
  affectedRows,
  affectedRecords,
  affectedCount,
  onConfirm,
  onCancel,
  isConfirming = false,
  isCompleted = false
}: ChatResponseProps) {
  // Estado para el modal de registros completos
  const [showFullDataModal, setShowFullDataModal] = useState(false);
  
  // Si se pasa un mensaje, extraer los datos de responseData
  const responseType = type || message?.responseData?.type;
  const responseSql = sql || message?.responseData?.sql;
  const responseData = data || message?.responseData?.data;
  const responseAffectedRows = affectedRows || message?.responseData?.affectedRows;
  const responseAffectedRecords = affectedRecords || message?.responseData?.affectedRecords;
  const responseAffectedCount = affectedCount || message?.responseData?.affectedCount;

  // Generar headers de la tabla si hay datos
  const headers = useMemo(() => {
    if (!responseData || responseData.length === 0) return [];
    return Object.keys(responseData[0]);
  }, [responseData]);

  // Si es un mensaje especial (sin conexión), renderizar como card
  if (message?.isSpecialMessage) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-muted">
            <Database className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">Configuración de Base de Datos Requerida</h3>
            <p className="text-muted-foreground text-sm">Para usar el asistente SQL necesitas configurar una conexión</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h4 className="font-medium text-foreground mb-3">Pasos para configurar:</h4>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-muted text-muted-foreground rounded-full text-xs flex items-center justify-center font-medium">1</span>
                <span>Ve a <strong>Conexiones</strong> en el sidebar izquierdo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-muted text-muted-foreground rounded-full text-xs flex items-center justify-center font-medium">2</span>
                <span>Haz clic en <strong>"Nueva Conexión"</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-muted text-muted-foreground rounded-full text-xs flex items-center justify-center font-medium">3</span>
                <span>Configura los datos de tu base de datos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-muted text-muted-foreground rounded-full text-xs flex items-center justify-center font-medium">4</span>
                <span>Activa la conexión una vez configurada</span>
              </li>
            </ol>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <h4 className="font-medium text-foreground mb-2">Después de configurar:</h4>
            <p className="text-muted-foreground text-sm">Podrás hacer consultas SQL en lenguaje natural y el asistente te ayudará a generar consultas automáticamente.</p>
          </div>
          
          <div className="text-center">
            <a 
              href="/connections" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Database className="w-4 h-4" />
              Ir a Conexiones
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay datos de respuesta, mostrar el contenido normal
  if (!responseType || !responseSql) {
    return (
      <div className="text-sm text-foreground whitespace-pre-line">
        {message?.content || 'Respuesta del bot'}
      </div>
    );
  }

  const getTypeIcon = () => {
    switch (responseType) {
      case 'select':
        return <Database className="w-5 h-5 text-blue-500" />;
      case 'insert':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'update':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'delete':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Database className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeTitle = () => {
    switch (responseType) {
      case 'select':
        return 'Consulta SELECT ejecutada';
      case 'insert':
        return 'Usuario insertado correctamente';
      case 'update':
        return 'Registros actualizados correctamente';
      case 'delete':
        return 'Registros eliminados correctamente';
      case 'pending':
        return 'Confirmación requerida';
      default:
        return 'Consulta ejecutada';
    }
  };

  const getTypeDescription = () => {
    switch (responseType) {
      case 'select':
        return `Se encontraron ${responseData?.length || 0} registros`;
      case 'insert':
        return `${responseAffectedRows || 0} registro(s) insertado(s)`;
      case 'update':
        return `${responseAffectedRows || 0} registro(s) actualizado(s)`;
      case 'delete':
        return `${responseAffectedRows || 0} registro(s) eliminado(s)`;
      case 'pending':
        return `Esta operación afectará a ${responseAffectedCount || 0} registro(s)`;
      default:
        return 'Operación completada';
    }
  };

  const renderDataTable = () => {
    if (!responseData || responseData.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No se encontraron registros</p>
        </div>
      );
    }

    const needsHorizontalScroll = headers.length > 5;

    // Calcular el ancho óptimo de cada columna basado en el contenido
    const calculateColumnWidths = () => {
      const columnWidths: { [key: string]: number } = {};
      const totalColumns = headers.length;
      
      headers.forEach(header => {
        let maxWidth = header.length * 10; // Ancho mínimo basado en el header (10px por carácter)
        
        // Calcular el ancho máximo basado en el contenido de todas las filas
        responseData.forEach(row => {
          const cellContent = row[header] !== null && row[header] !== undefined ? String(row[header]) : '';
          const cellWidth = Math.min(cellContent.length * 10, 400); // Máximo 400px por columna
          maxWidth = Math.max(maxWidth, cellWidth);
        });
        
        // Si no hay scroll horizontal, distribuir el espacio proporcionalmente
        if (!needsHorizontalScroll) {
          // Calcular el ancho disponible por columna (asumiendo un contenedor de ~800px)
          const availableWidth = 800;
          const padding = totalColumns * 24; // 24px de padding por columna (12px izquierda + 12px derecha)
          const availableContentWidth = availableWidth - padding;
          
          // Distribuir el ancho disponible proporcionalmente
          const proportionalWidth = availableContentWidth / totalColumns;
          maxWidth = Math.max(maxWidth, proportionalWidth);
        }
        
        columnWidths[header] = Math.max(maxWidth, 100); // Ancho mínimo de 100px
      });
      
      return columnWidths;
    };

    const columnWidths = calculateColumnWidths();

    return (
      <div className="bg-card rounded-md border border-border">
        {/* Indicador de scroll horizontal */}
        {needsHorizontalScroll && (
          <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border bg-muted/20 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Desliza horizontalmente para ver más columnas
          </div>
        )}
        
        {/* Contenedor con scroll horizontal */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <thead>
              <tr className="border-b border-border">
                {headers.map((header) => (
                  <th 
                    key={header} 
                    className="font-medium text-xs px-3 py-2 whitespace-nowrap bg-muted/50 text-left"
                    style={{ 
                      width: `${columnWidths[header]}px`,
                      minWidth: `${columnWidths[header]}px`
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responseData.slice(0, 10).map((row, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/30">
                  {headers.map((header) => (
                    <td 
                      key={header} 
                      className="text-xs px-3 py-2 whitespace-nowrap"
                      style={{ 
                        width: `${columnWidths[header]}px`,
                        minWidth: `${columnWidths[header]}px`
                      }}
                    >
                      {row[header] !== null && row[header] !== undefined ? (
                        header.toLowerCase().includes('password') ? (
                          <div 
                            className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap" 
                            title={String(row[header])}
                          >
                            {String(row[header])}
                          </div>
                        ) : (
                          <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap" title={String(row[header])}>
                            {String(row[header])}
                          </div>
                        )
                      ) : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {responseData.length > 10 && (
          <div className="px-3 py-2 text-xs text-muted-foreground border-t bg-muted/20 flex items-center justify-between">
            <span className="text-center flex-1">
              ... y {responseData.length - 10} registros más
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullDataModal(true)}
              className="h-6 px-2 text-xs border-border hover:bg-muted/50"
            >
              <Maximize2 className="w-3 h-3 mr-1" />
              Ver Todos
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderSQLSection = () => (
    <div className="bg-muted/50 rounded-lg p-3 border border-border">
      <h4 className="font-medium text-foreground mb-2 flex items-center gap-2 text-sm">
        <Code className="w-3 h-3 text-muted-foreground" />
        SQL Ejecutado
      </h4>
      <div className="bg-card border border-border rounded-md p-3 overflow-x-auto">
        <code className="text-primary text-xs font-mono whitespace-pre-wrap">
          {responseSql}
        </code>
      </div>
    </div>
  );

  const renderPendingConfirmation = () => (
    <div className="space-y-3">
      {renderSQLSection()}
      
      {responseAffectedRecords && responseAffectedRecords.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2 text-sm">
            <Database className="w-3 h-3 text-muted-foreground" />
            Registros que serán afectados ({responseAffectedCount})
          </h4>
          <div className="bg-card rounded-md border border-border">
            {(() => {
              const headers = Object.keys(responseAffectedRecords[0]);
              const needsHorizontalScroll = headers.length > 5;
              
              // Calcular el ancho óptimo de cada columna basado en el contenido
              const calculateColumnWidths = () => {
                const columnWidths: { [key: string]: number } = {};
                const totalColumns = headers.length;
                
                headers.forEach(header => {
                  let maxWidth = header.length * 10; // Ancho mínimo basado en el header (10px por carácter)
                  
                  // Calcular el ancho máximo basado en el contenido de todas las filas
                  responseAffectedRecords.forEach(row => {
                    const cellContent = row[header] !== null && row[header] !== undefined ? String(row[header]) : '';
                    const cellWidth = Math.min(cellContent.length * 10, 400); // Máximo 400px por columna
                    maxWidth = Math.max(maxWidth, cellWidth);
                  });
                  
                  // Si no hay scroll horizontal, distribuir el espacio proporcionalmente
                  if (!needsHorizontalScroll) {
                    // Calcular el ancho disponible por columna (asumiendo un contenedor de ~800px)
                    const availableWidth = 800;
                    const padding = totalColumns * 24; // 24px de padding por columna (12px izquierda + 12px derecha)
                    const availableContentWidth = availableWidth - padding;
                    
                    // Distribuir el ancho disponible proporcionalmente
                    const proportionalWidth = availableContentWidth / totalColumns;
                    maxWidth = Math.max(maxWidth, proportionalWidth);
                  }
                  
                  columnWidths[header] = Math.max(maxWidth, 100); // Ancho mínimo de 100px
                });
                
                return columnWidths;
              };

              const columnWidths = calculateColumnWidths();
              
              return (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        {headers.map((header) => (
                          <th 
                            key={header} 
                            className="font-medium text-xs px-3 py-2 whitespace-nowrap bg-muted/50 text-left"
                            style={{ 
                              width: `${columnWidths[header]}px`,
                              minWidth: `${columnWidths[header]}px`
                            }}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {responseAffectedRecords.slice(0, 3).map((row, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted/30">
                          {Object.entries(row).map(([key, value], cellIndex) => (
                            <td 
                              key={cellIndex} 
                              className="text-xs px-3 py-2 whitespace-nowrap"
                              style={{ 
                                width: `${columnWidths[key]}px`,
                                minWidth: `${columnWidths[key]}px`
                              }}
                            >
                              {value !== null && value !== undefined ? (
                                key.toLowerCase().includes('password') ? (
                                  <div 
                                    className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap" 
                                    title={String(value)}
                                  >
                                    {String(value)}
                                  </div>
                                ) : (
                                  <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap" title={String(value)}>
                                    {String(value)}
                                  </div>
                                )
                              ) : '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
            {responseAffectedRecords.length > 3 && (
              <div className="px-3 py-2 text-xs text-muted-foreground border-t text-center bg-muted/20">
                ... y {responseAffectedRecords.length - 3} registros más
                </div>
              )}
          </div>
        </div>
      )}

      {responseType === 'delete' && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-destructive text-sm">Advertencia</h5>
              <p className="text-xs text-muted-foreground mt-1">
                Esta acción eliminará permanentemente {responseAffectedCount} registro(s). Esta operación no se puede deshacer.
              </p>
            </div>
          </div>
        </div>
      )}

      {!isCompleted && (
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isConfirming}
            className="px-4 py-1 text-xs"
          >
            Cancelar
          </Button>
          <Button 
            variant={responseType === 'delete' ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-4 py-1 text-xs"
          >
            {isConfirming ? (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              'Aceptar Acción'
            )}
          </Button>
        </div>
      )}
    </div>
  );

  if (responseType === 'pending') {
    return (
      <div className="bg-card rounded-lg border border-border p-4 space-y-3">
        <div className="flex items-center gap-2">
          {getTypeIcon()}
          <div>
            <h3 className="font-semibold text-foreground text-sm">{getTypeTitle()}</h3>
            <p className="text-xs text-muted-foreground">{getTypeDescription()}</p>
          </div>
        </div>
        {renderPendingConfirmation()}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-3">
      <div className="flex items-center gap-2">
        {getTypeIcon()}
        <div>
          <h3 className="font-semibold text-foreground text-sm">{getTypeTitle()}</h3>
          <p className="text-xs text-muted-foreground">{getTypeDescription()}</p>
        </div>
      </div>
      
      {renderSQLSection()}
      
      {(responseType === 'select' || responseType === 'insert') && (
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2 text-sm">
            <Database className="w-3 h-3 text-muted-foreground" />
            {responseType === 'select' ? 'Resultados' : 'Tabla actualizada'}
          </h4>
          {renderDataTable()}
        </div>
      )}

      {/* Modal para mostrar todos los registros */}
      {showFullDataModal && responseData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="font-semibold text-foreground text-lg">Todos los Registros</h3>
                <p className="text-sm text-muted-foreground">
                  Mostrando {responseData.length} registros de la consulta
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullDataModal(false)}
                className="h-8 w-8 p-0 hover:bg-muted/50"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Contenido del modal con scroll */}
            <div className="flex-1 overflow-auto p-4">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      {headers.map((header) => (
                        <th 
                          key={header} 
                          className="font-medium text-xs px-3 py-2 whitespace-nowrap bg-muted/50 text-left sticky top-0"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {responseData.map((row, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/30">
                        {headers.map((header) => (
                          <td 
                            key={header} 
                            className="text-xs px-3 py-2 whitespace-nowrap"
                          >
                            {row[header] !== null && row[header] !== undefined ? (
                              header.toLowerCase().includes('password') ? (
                                <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap" title={String(row[header])}>
                                  {String(row[header])}
                                </div>
                              ) : (
                                <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap" title={String(row[header])}>
                                  {String(row[header])}
                                </div>
                              )
                            ) : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Footer del modal */}
            <div className="p-4 border-t border-border bg-muted/20">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total: {responseData.length} registros</span>
                <span>Consulta ejecutada exitosamente</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos CSS para mejorar la responsividad de las tablas */}
      <style>{`
        /* Scrollbar personalizado que se integra con el diseño */
        .overflow-x-auto {
          scrollbar-width: thin;
          scrollbar-color: var(--techwave-main-color) transparent;
        }
        
        .overflow-x-auto::-webkit-scrollbar {
          height: 12px;
          background: transparent;
        }
        
        .overflow-x-auto::-webkit-scrollbar-track {
          background: rgba(156, 163, 175, 0.1);
          border-radius: 6px;
          margin: 2px;
        }
        
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, var(--techwave-main-color), rgba(59, 130, 246, 0.8));
          border-radius: 6px;
          border: 2px solid transparent;
          background-clip: content-box;
          min-width: 40px;
        }
        
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, var(--techwave-main-color), rgba(59, 130, 246, 1));
        }
        
        .overflow-x-auto::-webkit-scrollbar-thumb:active {
          background: var(--techwave-main-color);
        }
        
        /* Asegurar que las tablas tengan scroll horizontal suave */
        .min-w-full {
          min-width: max-content;
        }
        
        /* Mejorar la legibilidad en dispositivos móviles */
        @media (max-width: 768px) {
          .px-3 {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          
          .text-xs {
            font-size: 0.75rem;
          }
          
          .overflow-x-auto::-webkit-scrollbar {
            height: 8px;
          }
        }
        
        /* Estilos para tablas sin scroll (ancho completo) */
        .w-full .table {
          width: 100%;
        }
        
        .w-full .table th,
        .w-full .table td {
          width: auto;
          min-width: auto;
        }
        
        /* Hover effects mejorados para las filas */
        .hover\\:bg-muted\\/30:hover {
          background-color: rgba(156, 163, 175, 0.15);
          transition: background-color 0.2s ease;
        }
        
        /* Transiciones suaves para mejor UX */
        .table th,
        .table td {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
} 