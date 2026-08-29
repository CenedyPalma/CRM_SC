"use client";

import { useState } from "react";
import { Database, Plus, Settings2, Trash2, Key, Type, Hash, Calendar, CheckSquare, Link as LinkIcon, DatabaseZap } from "lucide-react";
import { useRouter } from "next/navigation";
import { SchemaBuilder, SchemaDefinition } from "@/components/low-code/SchemaBuilder";

export function SchemaBuilderClient({ initialObjects }: { initialObjects: any[] }) {
  const [objects, setObjects] = useState<SchemaDefinition[]>(initialObjects);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(initialObjects[0]?.id || null);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const selectedObject = objects.find(o => o.id === selectedObjectId);

  const handleSaveSchema = async (schema: SchemaDefinition) => {
    const res = await fetch('/api/custom-objects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schema)
    });
    
    if (res.ok) {
      const saved = await res.json();
      setObjects([...objects, saved]);
      setSelectedObjectId(saved.id);
      setIsCreating(false);
      router.refresh();
    } else {
      throw new Error("Failed to save");
    }
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'TEXT': return <Type size={14} className="text-blue-600" />;
      case 'NUMBER': return <Hash size={14} className="text-emerald-600" />;
      case 'DATE': return <Calendar size={14} className="text-amber-600" />;
      case 'BOOLEAN': return <CheckSquare size={14} className="text-purple-600" />;
      case 'RELATION': return <LinkIcon size={14} className="text-rose-600" />;
      default: return <Type size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="flex h-full border border-slate-200 rounded-lg overflow-hidden bg-white">
      {/* Sidebar: Objects List */}
      <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
          <h2 className="text-sm font-semibold text-slate-800 flex items-center space-x-2">
            <Database size={16} className="text-indigo-600" />
            <span>Objects</span>
          </h2>
          <button 
            onClick={() => {
              setIsCreating(true);
              setSelectedObjectId(null);
            }}
            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {objects.map(obj => (
            <button
              key={obj.id}
              onClick={() => {
                setSelectedObjectId(obj.id!);
                setIsCreating(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
                selectedObjectId === obj.id 
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                  : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2">
                <DatabaseZap size={14} className={selectedObjectId === obj.id ? 'text-indigo-600' : 'text-slate-400'} />
                <span>{obj.name}</span>
              </div>
              <span className="text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">{obj.fields?.length || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Area: Schema Editor */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto p-6">
        {isCreating ? (
          <div>
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h1 className="text-2xl font-bold text-slate-800">Create New Object</h1>
              <button 
                onClick={() => setIsCreating(false)}
                className="text-sm text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>
            <SchemaBuilder onSave={handleSaveSchema} availableObjects={objects} />
          </div>
        ) : selectedObject ? (
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedObject.name}</h2>
                <p className="text-sm text-slate-500 mt-1">API Identifier: <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-xs border border-indigo-100">{selectedObject.apiName}</code></p>
                <p className="text-sm text-slate-600 mt-2">{selectedObject.description}</p>
              </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">Fields ({selectedObject.fields?.length || 0})</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Field Name</th>
                    <th className="px-4 py-3 font-medium">API Name</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-700 flex items-center space-x-2">
                      <Key size={14} className="text-amber-500" />
                      <span>ID</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">id</td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="flex items-center space-x-1">
                        <Hash size={14} className="text-slate-400" />
                        <span>UUID</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">System</td>
                  </tr>
                  
                  {selectedObject.fields?.map((field: any) => (
                    <tr key={field.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{field.name}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">{field.apiName}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-2 py-1 rounded w-fit text-xs">
                          {getFieldIcon(field.fieldType)}
                          <span>{field.fieldType}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {field.isRequired ? (
                          <span className="text-xs bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded">Yes</span>
                        ) : (
                          <span className="text-xs text-slate-500">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 flex-col space-y-4">
            <DatabaseZap size={48} className="text-slate-300" />
            <p>Select an object from the sidebar to view its schema.</p>
          </div>
        )}
      </div>
    </div>
  );
}
