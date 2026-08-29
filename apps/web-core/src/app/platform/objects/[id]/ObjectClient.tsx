"use client";

import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { SchemaDefinition } from "@/components/low-code/SchemaBuilder";
import { DynamicTable } from "@/components/low-code/DynamicTable";
import { DynamicForm } from "@/components/low-code/DynamicForm";
import { KanbanBuilder } from "@/components/low-code/KanbanBuilder";


interface ObjectClientProps {
  customObject: SchemaDefinition;
  initialRecords: any[];
}

export function ObjectClient({ customObject, initialRecords }: ObjectClientProps) {
  const [records, setRecords] = useState(initialRecords);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  const handleSave = async (data: any) => {
    const isEditing = !!editingRecord;
    const url = isEditing 
      ? `/api/custom-objects/${customObject.id}/records/${editingRecord.id}`
      : `/api/custom-objects/${customObject.id}/records`;
      
    const method = isEditing ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });

    if (res.ok) {
      const saved = await res.json();
      if (isEditing) {
        setRecords(records.map(r => r.id === saved.id ? saved : r));
      } else {
        setRecords([saved, ...records]);
      }
      setIsCreating(false);
      setEditingRecord(null);
    } else {
      throw new Error("Failed to save record");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    
    const res = await fetch(`/api/custom-objects/${customObject.id}/records/${id}`, {
      method: 'DELETE'
    });
    
    if (res.ok) {
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const handleRecordUpdate = async (recordId: string, updatedData: any) => {
    const res = await fetch(`/api/custom-objects/${customObject.id}/records/${recordId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: updatedData })
    });
    if (!res.ok) {
      throw new Error("Failed to update record");
    }
  };

  if (isCreating || editingRecord) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <DynamicForm 
          schema={customObject} 
          initialData={editingRecord ? editingRecord.data : {}}
          onSubmit={handleSave}
          onCancel={() => {
            setIsCreating(false);
            setEditingRecord(null);
          }}
        />
      </div>
    );
  }

  const hasSelectField = customObject.fields.some(f => f.fieldType === 'SELECT');

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex items-center justify-between p-6 bg-white border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Link href="/platform/schema" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {customObject.pluralName || customObject.name + 's'}
              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-500 ml-2 font-normal">
                {customObject.apiName}
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">{customObject.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Table
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Kanban
            </button>
          </div>
          <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> New {customObject.name}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === 'table' ? (
          <div className="h-full p-6 overflow-y-auto">
            <DynamicTable 
              schema={customObject} 
              data={records} 
              onEdit={(record) => setEditingRecord(record)}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          <KanbanBuilder 
            schema={customObject}
            records={records}
            onRecordUpdate={handleRecordUpdate}
          />
        )}
      </div>
    </div>
  );
}
