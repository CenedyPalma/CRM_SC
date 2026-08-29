'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createCustomField } from '../../app/platform/actions';

export function CreateCustomFieldModal({ customObjectId }: { customObjectId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-white rounded-md transition-colors shadow-sm flex items-center space-x-2"
      >
        <Plus size={16} />
        <span>Add Field</span>
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-white rounded-md transition-colors shadow-sm flex items-center space-x-2"
      >
        <Plus size={16} />
        <span>Add Field</span>
      </button>

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Add Custom Field</h2>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form 
            action={async (formData) => {
              await createCustomField(formData);
              setIsOpen(false);
            }} 
            className="p-6 space-y-4"
          >
            <input type="hidden" name="customObjectId" value={customObjectId} />
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Field Name</label>
              <input required name="name" type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="e.g. License Plate" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Field Type</label>
              <select required name="fieldType" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="TEXT">Text</option>
                <option value="NUMBER">Number</option>
                <option value="BOOLEAN">Checkbox (Yes/No)</option>
                <option value="DATE">Date</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="isRequired" name="isRequired" value="true" className="rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-600" />
              <label htmlFor="isRequired" className="text-sm font-medium text-zinc-300">Required Field</label>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-sm font-medium text-zinc-300 rounded-md transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-colors shadow-sm">
                Add Field
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
