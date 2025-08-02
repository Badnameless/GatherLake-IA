import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, AlertTriangle, Database, Code } from 'lucide-react';

interface ChatResponseProps {
  type: 'select' | 'insert' | 'update' | 'delete' | 'pending';
  sql: string;
  data?: any[];
  affectedRows?: number;
  affectedRecords?: any[];
  affectedCount?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
  isConfirming?: boolean;
  isCompleted?: boolean; // New prop to track if action is completed
}

export default function ChatResponse({
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
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  const getTypeIcon = () => {
    switch (type) {
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
    switch (type) {
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
    switch (type) {
      case 'select':
        return `Se encontraron ${data?.length || 0} registros`;
      case 'insert':
        return `${affectedRows || 0} registro(s) insertado(s)`;
      case 'update':
        return `${affectedRows || 0} registro(s) actualizado(s)`;
      case 'delete':
        return `${affectedRows || 0} registro(s) eliminado(s)`;
      case 'pending':
        return `Esta operación afectará a ${affectedCount || 0} registro(s)`;
      default:
        return 'Operación completada';
    }
  };

  const renderDataTable = () => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No se encontraron registros</p>
        </div>
      );
    }

    const headers = Object.keys(data[0]);

    return (
      <div className="bg-card rounded-md border border-border overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header} className="font-medium text-xs px-2 py-1">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 10).map((row, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell key={header} className="text-xs px-2 py-1">
                      {row[header] !== null && row[header] !== undefined ? (
                        header.toLowerCase().includes('password') ? (
                          <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap" title={String(row[header])}>
                            {String(row[header])}
                          </div>
                        ) : (
                          String(row[header])
                        )
                      ) : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.length > 10 && (
            <div className="px-2 py-1 text-xs text-muted-foreground border-t text-center">
              ... y {data.length - 10} registros más
            </div>
          )}
        </div>
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
          {sql}
        </code>
      </div>
    </div>
  );

  const renderPendingConfirmation = () => (
    <div className="space-y-3">
      {renderSQLSection()}
      
      {affectedRecords && affectedRecords.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2 text-sm">
            <Database className="w-3 h-3 text-muted-foreground" />
            Registros que serán afectados ({affectedCount})
          </h4>
          <div className="bg-card rounded-md border border-border overflow-hidden">
            <div className="max-h-32 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(affectedRecords[0]).map((header) => (
                      <TableHead key={header} className="font-medium text-xs px-2 py-1">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affectedRecords.slice(0, 3).map((row, index) => (
                    <TableRow key={index}>
                      {Object.entries(row).map(([key, value], cellIndex) => (
                        <TableCell key={cellIndex} className="text-xs px-2 py-1">
                          {value !== null && value !== undefined ? (
                            key.toLowerCase().includes('password') ? (
                              <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap" title={String(value)}>
                                {String(value)}
                              </div>
                            ) : (
                              String(value)
                            )
                          ) : '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {affectedRecords.length > 3 && (
                <div className="px-2 py-1 text-xs text-muted-foreground border-t text-center">
                  ... y {affectedRecords.length - 3} registros más
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {type === 'delete' && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-destructive text-sm">Advertencia</h5>
              <p className="text-xs text-muted-foreground mt-1">
                Esta acción eliminará permanentemente {affectedCount} registro(s). Esta operación no se puede deshacer.
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
            variant={type === 'delete' ? 'destructive' : 'default'}
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

  if (type === 'pending') {
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
      
      {(type === 'select' || type === 'insert') && (
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2 text-sm">
            <Database className="w-3 h-3 text-muted-foreground" />
            {type === 'select' ? 'Resultados' : 'Tabla actualizada'}
          </h4>
          {renderDataTable()}
        </div>
      )}
    </div>
  );
} 