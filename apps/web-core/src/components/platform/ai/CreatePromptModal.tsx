'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createPromptTemplate } from '../../../app/platform/ai/actions';

export function CreatePromptModal() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-colors shadow-sm shadow-indigo-900 flex items-center space-x-2"
      >
        <Plus size={16} />
        <span>New Prompt</span>
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
        <span>New Prompt</span>
      </button>

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Create Prompt Template</h2>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form 
            action={async (formData) => {
              await createPromptTemplate(formData);
              setIsOpen(false);
            }} 
            className="p-6 space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Template Name</label>
              <input required name="name" type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="e.g. Sales Email Generator" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">AI Model</label>
              <select required name="model" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300 flex justify-between">
                <span>System Prompt</span>
                <span className="text-xs text-zinc-500">Use {'{{variable}}'} for dynamic data</span>
              </label>
              <textarea required name="prompt" rows={5} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono" placeholder="Write a persuasive sales email to {{contact_name}} about {{deal_name}}..."></textarea>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-sm font-medium text-zinc-300 rounded-md transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-colors shadow-sm">
                Save Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
