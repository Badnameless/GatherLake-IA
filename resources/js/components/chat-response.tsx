import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, AlertTriangle, Database, Code } from 'lucide-react';
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
  // Si se pasa un mensaje, extraer los datos de responseData
  const responseType = type || message?.responseData?.type;
  const responseSql = sql || message?.responseData?.sql;
  const responseData = data || message?.responseData?.data;
  const responseAffectedRows = affectedRows || message?.responseData?.affectedRows;
  const responseAffectedRecords = affectedRecords || message?.responseData?.affectedRecords;
  const responseAffectedCount = affectedCount || message?.responseData?.affectedCount;

  // Si es un mensaje especial (sin conexión), renderizar como card
  if (message?.isSpecialMessage) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-foreground text-sm">No hay conexión activa</h3>
        </div>
        <div className="text-sm text-muted-foreground whitespace-pre-line">
          {message.content}
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

    const headers = Object.keys(responseData[0]);
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
        <div className={`${needsHorizontalScroll ? 'overflow-x-auto' : 'w-full'}`}>
          <div className={`${needsHorizontalScroll ? 'min-w-full inline-block align-middle' : 'w-full'}`}>
            <div className="overflow-hidden">
              <Table className={needsHorizontalScroll ? 'min-w-full' : 'w-full'}>
                <TableHeader>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHead 
                        key={header} 
                        className="font-medium text-xs px-3 py-2 whitespace-nowrap bg-muted/50"
                        style={{ 
                          width: needsHorizontalScroll ? `${columnWidths[header]}px` : 'auto',
                          minWidth: needsHorizontalScroll ? `${columnWidths[header]}px` : 'auto'
                        }}
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responseData.slice(0, 10).map((row, index) => (
                    <TableRow key={index} className="hover:bg-muted/30">
                      {headers.map((header) => (
                        <TableCell 
                          key={header} 
                          className="text-xs px-3 py-2 whitespace-nowrap"
                          style={{ 
                            width: needsHorizontalScroll ? `${columnWidths[header]}px` : 'auto',
                            minWidth: needsHorizontalScroll ? `${columnWidths[header]}px` : 'auto'
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
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        {responseData.length > 10 && (
          <div className="px-3 py-2 text-xs text-muted-foreground border-t text-center bg-muted/20">
            ... y {responseData.length - 10} registros más
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
                <div className={`${needsHorizontalScroll ? 'overflow-x-auto' : 'w-full'}`}>
                  <div className={`${needsHorizontalScroll ? 'min-w-full inline-block align-middle' : 'w-full'}`}>
                    <div className="overflow-hidden">
                      <Table className={needsHorizontalScroll ? 'min-w-full' : 'w-full'}>
                        <TableHeader>
                          <TableRow>
                            {headers.map((header) => (
                              <TableHead 
                                key={header} 
                                className="font-medium text-xs px-3 py-2 whitespace-nowrap bg-muted/50"
                                style={{ 
                                  width: needsHorizontalScroll ? `${columnWidths[header]}px` : 'auto',
                                  minWidth: needsHorizontalScroll ? `${columnWidths[header]}px` : 'auto'
                                }}
                              >
                                {header}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {responseAffectedRecords.slice(0, 3).map((row, index) => (
                            <TableRow key={index} className="hover:bg-muted/30">
                              {Object.entries(row).map(([key, value], cellIndex) => (
                                <TableCell 
                                  key={cellIndex} 
                                  className="text-xs px-3 py-2 whitespace-nowrap"
                                  style={{ 
                                    width: needsHorizontalScroll ? `${columnWidths[key]}px` : 'auto',
                                    minWidth: needsHorizontalScroll ? `${columnWidths[key]}px` : 'auto'
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
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
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