'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createContact } from '../app/actions';

export function CreateContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-colors shadow-sm shadow-indigo-900 flex items-center space-x-2"
      >
        <Plus size={16} />
        <span>Add Contact</span>
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
        <span>Add Contact</span>
      </button>

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Create New Contact</h2>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form 
            action={async (formData) => {
              await createContact(formData);
              setIsOpen(false);
            }} 
            className="p-6 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">First Name</label>
                <input required name="firstName" type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Jane" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Last Name</label>
                <input required name="lastName" type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Doe" />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Email</label>
              <input name="email" type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="jane@example.com" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Phone</label>
              <input name="phone" type="tel" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="+1 (555) 000-0000" />
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-sm font-medium text-zinc-300 rounded-md transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-colors shadow-sm">
                Save Contact
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
