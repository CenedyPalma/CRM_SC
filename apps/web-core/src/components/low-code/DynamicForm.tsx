'use client';

import React, { useState, useEffect } from 'react';

import { SchemaDefinition, FieldDefinition } from './SchemaBuilder';

interface DynamicFormProps {
  schema: SchemaDefinition;
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
}

export function DynamicForm({ schema, initialData, onSubmit, onCancel }: DynamicFormProps) {
  const [formData, setFormData] = useState<any>(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // For relation fields, we need to fetch the target object's records to show in a dropdown
  const [relationOptions, setRelationOptions] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchRelations = async () => {
      const newRelationOptions: Record<string, any[]> = {};
      
      for (const field of schema.fields) {
        if (field.fieldType === 'RELATION' && field.options?.targetObjectId) {
          try {
            const res = await fetch(`/api/custom-objects/${field.options.targetObjectId}/records`);
            if (res.ok) {
              const records = await res.json();
              newRelationOptions[field.apiName] = records;
            }
          } catch (e) {
            console.error(`Failed to fetch records for relation field ${field.name}`, e);
          }
        }
      }
      setRelationOptions(newRelationOptions);
    };

    fetchRelations();
  }, [schema]);

  const handleChange = (fieldApiName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldApiName]: value }));
    // Clear error for this field when changed
    if (errors[fieldApiName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldApiName];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    for (const field of schema.fields) {
      if (field.isRequired && !formData[field.apiName] && formData[field.apiName] !== false && formData[field.apiName] !== 0) {
        newErrors[field.apiName] = `${field.name} is required`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldInput = (field: FieldDefinition) => {
    const value = formData[field.apiName] || '';
    const hasError = !!errors[field.apiName];
    const inputClass = `w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${hasError ? 'border-red-500' : ''}`;

    switch (field.fieldType) {
      case 'TEXT':
        return (
          <input type="text" className={inputClass}
            id={field.apiName}
            value={value}
            onChange={(e) => handleChange(field.apiName, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );
      case 'NUMBER':
        return (
          <input type="number" className={inputClass}
            id={field.apiName}
            value={value}
            onChange={(e) => handleChange(field.apiName, e.target.value === '' ? '' : Number(e.target.value))}
          />
        );
      case 'DATE':
        return (
          <input type="date" className={inputClass}
            id={field.apiName}
            value={value}
            onChange={(e) => handleChange(field.apiName, e.target.value)}
          />
        );
      case 'BOOLEAN':
        return (
          <div className="flex items-center h-10">
            <input
              id={field.apiName}
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleChange(field.apiName, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
        );
      case 'SELECT':
        return (
          <select 
            id={field.apiName}
            value={value} 
            onChange={(e) => handleChange(field.apiName, e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>Select {field.name}</option>
            {(field.options?.choices || []).map((choice: string) => (
              <option key={choice} value={choice}>{choice}</option>
            ))}
          </select>
        );
      case 'RELATION':
        const records = relationOptions[field.apiName] || [];
        return (
          <select 
            id={field.apiName}
            value={value} 
            onChange={(e) => handleChange(field.apiName, e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>Select {field.name}</option>
            {records.map((rec) => (
              <option key={rec.id} value={rec.id}>
                {rec.data?.name || rec.data?.title || rec.id}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input type="text" className={inputClass}
            id={field.apiName}
            value={value}
            onChange={(e) => handleChange(field.apiName, e.target.value)}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{initialData ? `Edit ${schema.name}` : `New ${schema.name}`}</h2>
        {schema.description && <p className="text-sm text-gray-500 mt-1">{schema.description}</p>}
      </div>

      <div className="space-y-4">
        {schema.fields.map((field) => (
          <div key={field.apiName} className="space-y-2">
            <label htmlFor={field.apiName} className="text-sm font-medium text-slate-700 block">
              {field.name} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            {renderFieldInput(field)}
            {errors[field.apiName] && (
              <p className="text-sm text-red-500">{errors[field.apiName]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <button type="button" className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        )}
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
