import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';

type FilterConfig = {
  type: 'text' | 'dropdown';
  options?: Array<{ name: string } | string>;
  placeholder?: string;
};

type GenericDataTableProps = {
  dataKey: string;
  columns: Array<{
    field: string;
    header: string;
    filter?: FilterConfig;
    body?: (rowData: any) => React.ReactNode;
    style?: React.CSSProperties;
  }>;
  value: any[]; // Ahora es obligatorio y no usamos fetchData
  globalFilterFields?: string[];
  paginator?: boolean;
  rows?: number;
  loading?: boolean;
};

export const GenericDataTable = ({
  dataKey,
  columns,
  value = [],
  globalFilterFields = [],
  paginator = true,
  rows = 10,
  loading = false,
}: GenericDataTableProps) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    const initialFilters: Record<string, any> = { global: filters.global };
    columns.forEach((col) => {
      if (col.filter) {
        initialFilters[col.field] = { value: null, matchMode: FilterMatchMode.STARTS_WITH };
      }
    });
    setFilters(initialFilters);
  }, [columns]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, global: { value, matchMode: FilterMatchMode.CONTAINS } }));
    setGlobalFilterValue(value);
  };

  const renderHeader = () => (
    <div className="flex justify-end">
      <IconField iconPosition="left" className="dark-search-field">
        <InputIcon className="pi pi-search" style={{ color: '#A1A1AA' }} />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Buscar..."
          className="dark-input"
        />
      </IconField>
    </div>
  );

  const getFilterElement = (column: any) => {
    const filterConfig = column.filter;
    if (!filterConfig) return null;

    switch (filterConfig.type) {
      case 'text':
        return (options: any) => (
          <InputText
            value={options.value ?? ''}
            onChange={(e) => options.filterApplyCallback(e.target.value)}
            placeholder={filterConfig.placeholder || `Filtrar por ${column.header}`}
            className="dark-input"
          />
        );
      case 'dropdown':
        return (options: any) => (
          <Dropdown
            value={options.value ?? ''}
            options={filterConfig.options}
            onChange={(e) => options.filterApplyCallback(e.value)}
            optionLabel="name"
            placeholder={filterConfig.placeholder || 'Seleccionar'}
            className="dark-dropdown"
            panelClassName="dark-dropdown-panel"
            showClear
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="dark-datatable-container">
      <DataTable
        value={value}  // Usamos directamente los datos proporcionados
        paginator={paginator}
        rows={rows}
        dataKey={dataKey}
        filters={filters}
        filterDisplay="row"
        loading={loading}
        globalFilterFields={globalFilterFields}
        header={renderHeader()}
        emptyMessage="No se encontraron registros."
        className="dark-datatable"
        rowClassName={(rowData) => {
            const index = value.findIndex((d) => d[dataKey] === rowData[dataKey]);
            return classNames({
              'dark-row-even': index % 2 === 0,
              'dark-row-odd': index % 2 !== 0,
            });
        }}
      >
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            body={col.body}
            style={col.style}
            filter={!!col.filter}
            filterElement={col.filter ? getFilterElement(col) : undefined}
            showFilterMenu={false}
          />
        ))}
      </DataTable>

      {/* Estilos inline como fallback */}
      <style>{`
      .dark-datatable-container {
          background-color: #171717;
          border-radius: 8px;
          overflow: hidden;
      }

      .dark-datatable .p-datatable-header {
          background-color: #0A0A0A !important;
          border-color: #2D2D2D !important;
          color: #FFFFFF !important;
      }

      .dark-datatable .p-datatable-thead > tr > th {
          background-color: #0A0A0A !important;
          color: #FFFFFF !important;
          border-color: #2D2D2D !important;
      }

      .dark-datatable .p-datatable-tbody > tr {
          background-color: #0A0A0A !important;
          color: #E5E5E5 !important;
          border-color: #2D2D2D !important;
      }

      .dark-datatable .p-datatable-tbody > tr:hover {
          background-color: #1F1F1F !important;
      }

      .dark-datatable .p-paginator {
          background-color: #0A0A0A !important;
          border-color: #2D2D2D !important;
          color: #FFFFFF !important;
          border-bottom: none;
      }

      .dark-input,
      .dark-input:hover,
      .dark-input:focus {
          background-color: #0A0A0A !important;
          border-color: #2D2D2D !important;
          color: #FFFFFF !important;
          box-shadow: none !important;
      }

      .dark-dropdown {
          background-color: #0A0A0A !important;
          border-color: #2D2D2D !important;
          color: #FFFFFF !important;
      }

      .dark-dropdown-panel {
          background-color: #0A0A0A !important;
          border-color: #2D2D2D !important;
          color: #FFFFFF !important;
      }

      .dark-dropdown-panel .p-dropdown-items .p-dropdown-item {
          color: #E5E5E5 !important;
      }

      .dark-dropdown-panel .p-dropdown-items .p-dropdown-item:hover {
          background-color: #1F1F1F !important;
      }

      .dark-search-field .p-input-icon-left > i {
          color: #A1A1AA !important;
      }

      .dark-row-even {
          background-color: #171717 !important;
      }

      .dark-row-odd {
          background-color: #1F1F1F !important;
      }
      `}</style>


    </div>
  );
};