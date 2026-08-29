'use client';

import React, { useState } from 'react';
import { FileText, Save, Settings, Download, Printer } from 'lucide-react';

export function PDFBuilder() {
  const [title, setTitle] = useState('Invoice #INV-2024-001');
  const [content, setContent] = useState('This is a dynamically generated PDF document. You can inject variables like {{deal.amount}} directly into these templates.');

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Top Navigation */}
      <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-indigo-600" />
          <div>
            <h1 className="font-semibold text-slate-900 leading-tight">PDF Template Builder</h1>
            <p className="text-xs text-slate-500">Design dynamic documents</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-md transition-colors flex items-center gap-2">
            <Download size={14} /> Download Sample
          </button>
          <button className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2">
            <Save size={14} /> Save Template
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Settings Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold">
            <Settings size={18} /> Template Properties
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Template Name</label>
              <input 
                type="text" 
                defaultValue="Standard Invoice"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Document Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Document Content</label>
              <textarea 
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-200">
               <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Available Variables</h3>
               <div className="flex flex-wrap gap-2">
                 <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-mono cursor-pointer hover:bg-indigo-100">{`{{record.id}}`}</span>
                 <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-mono cursor-pointer hover:bg-indigo-100">{`{{record.createdAt}}`}</span>
                 <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-mono cursor-pointer hover:bg-indigo-100">{`{{tenant.name}}`}</span>
               </div>
            </div>
          </div>
        </div>

        {/* PDF Live Preview */}
        <div className="flex-1 bg-slate-200/80 p-8 flex flex-col items-center overflow-y-auto">
           <div className="w-full max-w-3xl flex flex-col gap-4">
             <div className="flex items-center justify-between">
               <h3 className="text-sm font-semibold text-slate-600 flex items-center gap-2"><Printer size={16} /> Live HTML Preview (A4)</h3>
             </div>
             {/* A4 Paper Mockup */}
             <div className="bg-white shadow-xl aspect-[1/1.414] w-full p-12 flex flex-col text-slate-800 border border-slate-300">
                <h1 className="text-2xl font-bold uppercase text-center mb-8 border-b-2 border-slate-800 pb-4">{title}</h1>
                <p className="text-sm leading-relaxed text-slate-600 flex-1 whitespace-pre-wrap">{content}</p>
                <div className="mt-8 pt-4 border-t-2 border-slate-800 text-center text-xs text-slate-400">
                  Generated by Enterprise OS
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
