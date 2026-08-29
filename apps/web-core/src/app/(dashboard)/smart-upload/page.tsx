'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, Loader2, FileText, X } from 'lucide-react';

export default function SmartUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleProcess = async () => {
    if (!preview) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const res = await fetch('/api/ai/ocr/process-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Data: preview }),
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process document');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Smart Ingestion</h1>
        <p className="text-zinc-400">Upload an invoice, receipt, or document. Our AI will automatically infer a database schema and extract the data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Column */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
              <h2 className="text-lg font-medium text-zinc-200">1. Upload Document</h2>
              {file && (
                <button onClick={reset} className="text-zinc-500 hover:text-zinc-300">
                  <X size={18} />
                </button>
              )}
            </div>
            
            <div className="p-6">
              {!file ? (
                <div 
                  className="border-2 border-dashed border-zinc-700 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-indigo-500 hover:bg-indigo-500/5 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud size={48} className="text-zinc-500 mb-4" />
                  <p className="text-zinc-300 font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-zinc-500 text-sm">PNG, JPG, PDF up to 10MB</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                    <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-lg">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-zinc-200 font-medium truncate">{file.name}</p>
                      <p className="text-zinc-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <CheckCircle className="text-green-500" size={20} />
                  </div>
                  
                  {preview && file.type.startsWith('image/') && (
                    <div className="relative h-64 rounded-lg overflow-hidden border border-zinc-800">
                      <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-contain bg-black/40" />
                    </div>
                  )}
                  
                  <button 
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Analyzing Document...</span>
                      </>
                    ) : (
                      <>
                        <span>Extract Data & Infer Schema</span>
                      </>
                    )}
                  </button>
                  
                  {error && (
                    <div className="p-3 bg-red-900/20 border border-red-900/50 text-red-400 text-sm rounded-lg">
                      {error}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="space-y-6">
          <div className={`bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl transition-opacity duration-500 ${result ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
              <h2 className="text-lg font-medium text-zinc-200">2. Review & Save</h2>
            </div>
            
            {result ? (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-indigo-400 mb-3 uppercase tracking-wider">Inferred Schema</h3>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-300 font-medium">{result.schema?.name}</span>
                      <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">API Name: {result.schema?.apiName}</span>
                    </div>
                    <p className="text-sm text-zinc-500 mb-4">{result.schema?.description}</p>
                    
                    <div className="space-y-2">
                      {result.schema?.fields?.map((field: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-sm py-1 border-t border-zinc-800/50">
                          <span className="text-zinc-400">{field.name}</span>
                          <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">{field.fieldType}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-green-400 mb-3 uppercase tracking-wider">Extracted Record Data</h3>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-3">
                    {Object.entries(result.data || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-start border-b border-zinc-800/50 pb-2 last:border-0 last:pb-0">
                        <span className="text-zinc-400 text-sm font-mono">{key}</span>
                        <span className="text-zinc-200 text-sm text-right font-medium max-w-[60%]">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors border border-zinc-700">
                  Accept Schema & Save Record
                </button>
              </div>
            ) : (
              <div className="p-6 h-64 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={24} className="text-zinc-600" />
                </div>
                <p className="text-zinc-500">Awaiting document extraction...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
