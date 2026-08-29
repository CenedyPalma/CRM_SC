import React from 'react';
import { Mail, Type, Image, Layout, BoxSelect, CheckSquare, Maximize2 } from 'lucide-react';

export function EmailBuilder() {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Mail size={20} />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 text-lg">Email Template Builder</h1>
            <p className="text-xs text-slate-500">Design beautiful emails for your automated workflows.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            Send Test
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors">
            Save Template
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-1 overflow-y-auto">
           <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Content Blocks</h3>
           <div className="grid grid-cols-2 gap-2">
             <div className="border border-slate-200 p-3 rounded-lg text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors group">
               <Type size={20} className="mx-auto text-slate-400 group-hover:text-indigo-500 mb-1" />
               <span className="text-xs font-medium text-slate-600">Text</span>
             </div>
             <div className="border border-slate-200 p-3 rounded-lg text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors group">
               <Image size={20} className="mx-auto text-slate-400 group-hover:text-indigo-500 mb-1" />
               <span className="text-xs font-medium text-slate-600">Image</span>
             </div>
             <div className="border border-slate-200 p-3 rounded-lg text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors group">
               <BoxSelect size={20} className="mx-auto text-slate-400 group-hover:text-indigo-500 mb-1" />
               <span className="text-xs font-medium text-slate-600">Button</span>
             </div>
             <div className="border border-slate-200 p-3 rounded-lg text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors group">
               <Layout size={20} className="mx-auto text-slate-400 group-hover:text-indigo-500 mb-1" />
               <span className="text-xs font-medium text-slate-600">Divider</span>
             </div>
           </div>
        </div>

        <div className="flex-1 bg-slate-200/50 p-8 flex justify-center overflow-y-auto">
          {/* Email Canvas Mockup */}
          <div className="w-full max-w-2xl bg-white shadow-md border border-slate-200 min-h-[600px] flex flex-col">
            <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center gap-4 text-sm text-slate-600">
               <span className="font-medium">Subject:</span>
               <input type="text" className="bg-transparent flex-1 outline-none text-slate-900" defaultValue="Welcome to our platform!" />
            </div>
            <div className="p-12 flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 m-8 rounded-xl bg-slate-50/50">
               <Type size={32} className="text-slate-300 mb-4" />
               <p className="text-slate-500 font-medium">Drag and drop content blocks here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
