'use client';

import React from 'react';
import { SchemaDefinition } from './SchemaBuilder';
import { Edit, Trash2 } from 'lucide-react';


interface DynamicTableProps {
  schema: SchemaDefinition;
  data: any[];
  onEdit?: (record: any) => void;
  onDelete?: (id: string) => void;
}

export function DynamicTable({ schema, data, onEdit, onDelete }: DynamicTableProps) {
  // If no fields, nothing to render
  if (!schema.fields || schema.fields.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white border rounded-xl shadow-sm">
        No schema fields defined.
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="px-6 py-4 w-24">ID</th>
              {schema.fields.map((field) => (
                <th key={field.apiName} className="px-6 py-4 whitespace-nowrap">
                  {field.name}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 text-right w-24">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.length === 0 ? (
              <tr>
                <td colSpan={schema.fields.length + 2} className="px-6 py-12 text-center text-gray-500">
                  No {schema.pluralName?.toLowerCase() || schema.name.toLowerCase() + 's'} found.
                </td>
              </tr>
            ) : (
              data.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {record.id.slice(-6)}
                  </td>
                  {schema.fields.map((field) => {
                    const val = record.data ? record.data[field.apiName] : undefined;
                    return (
                      <td key={field.apiName} className="px-6 py-4">
                        {field.fieldType === 'BOOLEAN' ? (
                          val ? <span className="text-green-600">Yes</span> : <span className="text-gray-400">No</span>
                        ) : field.fieldType === 'DATE' && val ? (
                          new Date(val).toLocaleDateString()
                        ) : (
                          String(val ?? '')
                        )}
                      </td>
                    );
                  })}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-right space-x-2">
                      {onEdit && (
                      <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded" onClick={() => onEdit(record)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      )}
                      {onDelete && (
                        <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" onClick={() => onDelete(record.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
