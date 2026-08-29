'use client';

import React, { useState } from 'react';

import { Plus, Trash2, Save, Database, Type, Hash, Calendar, ToggleLeft, Link as LinkIcon } from 'lucide-react';

export type FieldType = 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'RELATION' | 'SELECT';

export interface FieldDefinition {
  id?: string;
  name: string;
  apiName: string;
  fieldType: FieldType;
  isRequired: boolean;
  defaultValue?: string;
  isUnique?: boolean;
  options?: any;
}

export interface SchemaDefinition {
  id?: string;
  name: string;
  pluralName: string;
  apiName: string;
  description: string;
  icon?: string;
  fields: FieldDefinition[];
}

interface SchemaBuilderProps {
  initialSchema?: SchemaDefinition;
  availableObjects?: SchemaDefinition[];
  onSave: (schema: SchemaDefinition) => Promise<void>;
}

const FIELD_TYPES = [
  { value: 'TEXT', label: 'Text', icon: <Type className="w-4 h-4 mr-2" /> },
  { value: 'NUMBER', label: 'Number', icon: <Hash className="w-4 h-4 mr-2" /> },
  { value: 'DATE', label: 'Date', icon: <Calendar className="w-4 h-4 mr-2" /> },
  { value: 'BOOLEAN', label: 'Boolean', icon: <ToggleLeft className="w-4 h-4 mr-2" /> },
  { value: 'SELECT', label: 'Select (Dropdown)', icon: <ToggleLeft className="w-4 h-4 mr-2" /> },
  { value: 'RELATION', label: 'Relation', icon: <LinkIcon className="w-4 h-4 mr-2" /> },
];

export function SchemaBuilder({ initialSchema, availableObjects = [], onSave }: SchemaBuilderProps) {
  const [schema, setSchema] = useState<SchemaDefinition>(
    initialSchema || {
      name: '',
      pluralName: '',
      apiName: '',
      description: '',
      fields: [],
    }
  );
  const [isSaving, setIsSaving] = useState(false);

  const generateApiName = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  };

  const addField = () => {
    setSchema(prev => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          name: '',
          apiName: '',
          fieldType: 'TEXT',
          isRequired: false,
        },
      ],
    }));
  };

  const updateField = (index: number, updates: Partial<FieldDefinition>) => {
    setSchema(prev => {
      const newFields = [...prev.fields];
      newFields[index] = { ...newFields[index], ...updates };
      
      // Auto-generate API name if name is updated and API name is empty
      if (updates.name !== undefined && !newFields[index].apiName) {
        newFields[index].apiName = generateApiName(updates.name);
      }
      
      return { ...prev, fields: newFields };
    });
  };

  const removeField = (index: number) => {
    setSchema(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!schema.name || !schema.apiName) {
      alert("Please provide an object name and API name.");
      return;
    }
    
    // Validate fields
    for (const field of schema.fields) {
      if (!field.name || !field.apiName) {
        alert("All fields must have a name and API name.");
        return;
      }
    }

    try {
      setIsSaving(true);
      await onSave(schema);
    } catch (err) {
      console.error(err);
      alert("Failed to save schema.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Object Definition Card */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Data Object</h2>
            <p className="text-sm text-gray-500">Define the database table properties</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className=" text-sm font-medium text-slate-700">Object Name (Singular)</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="e.g. Property" 
              value={schema.name}
              onChange={e => {
                const name = e.target.value;
                setSchema(prev => ({
                  ...prev, 
                  name,
                  pluralName: prev.pluralName || name + 's',
                  apiName: prev.apiName || generateApiName(name)
                }));
              }}
            />
          </div>
          <div className="space-y-2">
            <label className=" text-sm font-medium text-slate-700">Plural Name</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="e.g. Properties" 
              value={schema.pluralName}
              onChange={e => setSchema(prev => ({ ...prev, pluralName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className=" text-sm font-medium text-slate-700">API Name (Database Identifier)</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" 
              placeholder="e.g. property" 
              value={schema.apiName}
              onChange={e => setSchema(prev => ({ ...prev, apiName: e.target.value }))}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className=" text-sm font-medium text-slate-700">Description</label>
            <textarea 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="What is this object used for?" 
              value={schema.description}
              onChange={e => setSchema(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Fields Definition Card */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Custom Fields</h2>
            <p className="text-sm text-gray-500">Define the schema columns</p>
          </div>
          <button onClick={addField} className="px-3 py-1.5 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 rounded text-sm transition-colors flex items-center">
            <Plus size={16} className="mr-2" /> Add First Field
          </button>
        </div>

        {schema.fields.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg text-gray-400">
            No fields defined yet. Click "Add Field" to start building your schema.
          </div>
        ) : (
          <div className="space-y-4">
            {schema.fields.map((field, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50/50">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Field Name</label>
                      <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="e.g. Purchase Price" 
                        value={field.name}
                        onChange={e => updateField(index, { name: e.target.value })}
                        size={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">API Name</label>
                      <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" 
                        placeholder="e.g. purchase_price" 
                        value={field.apiName}
                        onChange={e => updateField(index, { apiName: e.target.value })}
                        size={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Field Type</label>
                      <select 
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={field.fieldType}
                        onChange={e => updateField(index, { fieldType: e.target.value as FieldType })}
                      >
                        {FIELD_TYPES.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Additional settings based on field type */}
                  {field.fieldType === 'SELECT' && (
                    <div className="space-y-2 mt-4 p-3 bg-white rounded border border-slate-200">
                      <label className="text-sm font-medium text-slate-700">Options (Comma separated)</label>
                      <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="e.g. High, Medium, Low" 
                        value={field.options?.choices?.join(', ') || ''}
                        onChange={e => {
                          const choices = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          updateField(index, { options: { ...field.options, choices } });
                        }}
                      />
                    </div>
                  )}

                  {field.fieldType === 'RELATION' && (
                    <div className="space-y-2 mt-4 p-3 bg-white rounded border border-slate-200">
                      <label className="text-sm font-medium text-slate-700">Target Object</label>
                      <select 
                        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={field.options?.targetObjectId || ''}
                        onChange={e => updateField(index, { options: { ...field.options, targetObjectId: e.target.value } })}
                      >
                        <option value="" disabled>Select Target Object</option>
                        {availableObjects.map(obj => (
                          <option key={obj.id} value={obj.id}>{obj.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id={`required-${index}`} checked={field.isRequired} onChange={(e) => updateField(index, { isRequired: e.target.checked })} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
                        <label htmlFor={`required-${index}`} className="text-sm font-medium text-slate-700">Required</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id={`unique-${index}`} checked={field.isUnique} onChange={(e) => updateField(index, { isUnique: e.target.checked })} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
                        <label htmlFor={`unique-${index}`} className="text-sm font-medium text-slate-700">Unique</label>
                      </div>
                    </div>
                </div>
                <button 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded"
                  onClick={() => removeField(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          <Save className="w-4 h-4 mr-2" /> 
          {isSaving ? 'Saving...' : 'Save Schema'}
        </button>
      </div>
    </div>
  );
}
