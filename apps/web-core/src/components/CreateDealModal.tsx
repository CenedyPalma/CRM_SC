'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createDeal } from '../app/actions';

export function CreateDealModal() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-colors shadow-sm shadow-indigo-900 flex items-center space-x-2"
      >
        <Plus size={16} />
        <span>New Deal</span>
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
        <span>New Deal</span>
      </button>

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Create New Deal</h2>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form 
            action={async (formData) => {
              await createDeal(formData);
              setIsOpen(false);
            }} 
            className="p-6 space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Deal Title</label>
              <input required name="title" type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="e.g. Enterprise License Q4" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Amount ($)</label>
              <input required name="amount" type="number" min="0" step="0.01" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="50000" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Pipeline Stage</label>
              <select required name="stage" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="Lead">Lead</option>
                <option value="Meeting Scheduled">Meeting Scheduled</option>
                <option value="Proposal">Proposal</option>
                <option value="Closed Won">Closed Won</option>
              </select>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-sm font-medium text-zinc-300 rounded-md transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-colors shadow-sm">
                Save Deal
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
