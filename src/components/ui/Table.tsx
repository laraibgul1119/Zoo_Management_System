import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  actions?: (item: T) => React.ReactNode;
  striped?: boolean;
}

export function Table<T>({
  data,
  columns,
  keyField,
  actions,
  striped = true
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto border-4 border-black shadow-brutal">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-black text-white">
            {columns.map((col, index) => (
              <th 
                key={index} 
                className={`p-4 font-bold uppercase tracking-wider text-sm border-r-3 border-white last:border-r-0 ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
            {actions && (
              <th className="p-4 font-bold uppercase tracking-wider text-sm text-right">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr 
              key={String(item[keyField])} 
              className={`
                border-b-3 border-black last:border-b-0 
                ${striped && rowIndex % 2 === 0 ? 'bg-white' : striped ? 'bg-neutral-50' : 'bg-white'}
                hover:bg-accent-yellow/20 transition-brutal
              `}
            >
              {columns.map((col, colIndex) => (
                <td 
                  key={colIndex} 
                  className="p-4 border-r-3 border-black last:border-r-0 font-medium"
                >
                  {typeof col.accessor === 'function' 
                    ? col.accessor(item) 
                    : item[col.accessor] as React.ReactNode}
                </td>
              ))}
              {actions && (
                <td className="p-4 text-right">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td 
                colSpan={columns.length + (actions ? 1 : 0)} 
                className="p-8 text-center font-bold text-neutral-800"
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}