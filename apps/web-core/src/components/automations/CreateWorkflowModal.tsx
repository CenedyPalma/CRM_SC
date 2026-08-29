'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createWorkflow } from '../../app/automations/actions';

export function CreateWorkflowModal() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-colors shadow-sm shadow-indigo-900 flex items-center space-x-2"
      >
        <Plus size={16} />
        <span>New Workflow</span>
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-colors shadow-sm shadow-indigo-900 flex items-center space-x-2"
      >
        <Plus size={16} />
        <span>New Workflow</span>
      </button>

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Create Workflow</h2>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form 
            action={async (formData) => {
              await createWorkflow(formData);
              setIsOpen(false);
            }} 
            className="p-6 space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Workflow Name</label>
              <input required name="name" type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="e.g. New Lead Welcome" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Description</label>
              <textarea name="description" rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="What does this do?"></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Trigger Event</label>
              <select required name="triggerType" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="ON_RECORD_CREATE">When a record is created</option>
                <option value="ON_RECORD_UPDATE">When a record is updated</option>
                <option value="SCHEDULED">On a schedule</option>
                <option value="WEBHOOK">Incoming Webhook</option>
              </select>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-sm font-medium text-zinc-300 rounded-md transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-colors shadow-sm">
                Create Workflow
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
