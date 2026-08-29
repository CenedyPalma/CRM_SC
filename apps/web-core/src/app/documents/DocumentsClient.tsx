"use client";

import { useState } from "react";
import { Folder as FolderIcon, File as FileIcon, MoreVertical, Search, Upload, Plus, ChevronRight, FileText, FileImage, FileAudio, FileVideo, Archive, FileCode2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return <FileImage className="text-blue-400" size={24} />;
  if (mimeType.startsWith('video/')) return <FileVideo className="text-purple-400" size={24} />;
  if (mimeType.startsWith('audio/')) return <FileAudio className="text-amber-400" size={24} />;
  if (mimeType === 'application/pdf') return <FileText className="text-rose-400" size={24} />;
  if (mimeType === 'application/zip') return <Archive className="text-emerald-400" size={24} />;
  if (mimeType.includes('json') || mimeType.includes('javascript') || mimeType.includes('text/html')) return <FileCode2 className="text-amber-500" size={24} />;
  return <FileIcon className="text-zinc-400" size={24} />;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function DocumentsClient({ 
  initialFolders, 
  initialDocuments, 
  currentFolder,
  currentFolderId
}: { 
  initialFolders: any[], 
  initialDocuments: any[],
  currentFolder: any | null,
  currentFolderId: string
}) {
  const [folders, setFolders] = useState(initialFolders);
  const [documents, setDocuments] = useState(initialDocuments);
  const router = useRouter();

  const handleCreateFolder = async () => {
    const name = prompt("Folder name:");
    if (!name) return;
    
    const res = await fetch(`/api/documents/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': 'default-tenant'
      },
      body: JSON.stringify({ name, parentId: currentFolderId })
    });
    
    if (res.ok) {
      const newFolder = await res.json();
      setFolders([...folders, newFolder]);
      router.refresh();
    }
  };

  const handleUploadFile = async () => {
    // Simulated upload for demo
    const name = prompt("Mock File Name (e.g. presentation.pdf):", "new_document.pdf");
    if (!name) return;
    
    const res = await fetch(`/api/documents/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': 'default-tenant'
      },
      body: JSON.stringify({ 
        name, 
        folderId: currentFolderId,
        mimeType: name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream',
        size: Math.floor(Math.random() * 5000000) + 10240
      })
    });
    
    if (res.ok) {
      const newDoc = await res.json();
      setDocuments([newDoc, ...documents]);
      router.refresh();
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-sm text-zinc-400">
          <Link href="/documents" className="hover:text-white transition-colors">Files</Link>
          {currentFolder && (
            <>
              <ChevronRight size={14} />
              <span className="text-zinc-200">{currentFolder.name}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search files..." 
              className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all"
            />
          </div>
          <button 
            onClick={handleCreateFolder}
            className="flex items-center space-x-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm font-medium transition-colors border border-zinc-700"
          >
            <FolderIcon size={16} />
            <span>New Folder</span>
          </button>
          <button 
            onClick={handleUploadFile}
            className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Upload size={16} />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* File Explorer Grid */}
      <div className="flex-1 overflow-y-auto">
        {(folders.length === 0 && documents.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-xl">
            <Upload size={48} className="text-zinc-700 mb-4" />
            <p className="text-zinc-400 font-medium">This folder is empty</p>
            <p className="text-xs mt-1">Upload a file or create a folder to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {/* Folders */}
            {folders.map(folder => (
              <Link 
                href={`/documents?folderId=${folder.id}`} 
                key={folder.id}
                className="group p-4 bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative"
              >
                <FolderIcon size={48} className="text-indigo-500/80 group-hover:text-indigo-400 mb-3" />
                <span className="text-sm font-medium text-zinc-200 text-center w-full truncate px-2">{folder.name}</span>
                <button className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={14} />
                </button>
              </Link>
            ))}

            {/* Documents */}
            {documents.map(doc => (
              <div 
                key={doc.id}
                className="group p-4 bg-zinc-900/30 hover:bg-zinc-800/60 border border-zinc-800/50 hover:border-zinc-700 rounded-xl flex flex-col items-center justify-center transition-all relative"
              >
                <div className="h-16 flex items-center justify-center mb-2">
                  {getFileIcon(doc.mimeType)}
                </div>
                <span className="text-sm font-medium text-zinc-300 text-center w-full truncate px-2">{doc.name}</span>
                <span className="text-xs text-zinc-500 mt-1">{formatBytes(doc.size)}</span>
                <button className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
