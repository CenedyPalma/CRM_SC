"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Briefcase, Users, Ticket, Contact, Folder, Loader2 } from "lucide-react";

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:3019/search?q=${encodeURIComponent(query)}`, {
          headers: { "x-tenant-id": "default-tenant" }
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case "CONTACT": return <Users size={16} className="text-indigo-400" />;
      case "DEAL": return <Briefcase size={16} className="text-amber-400" />;
      case "TICKET": return <Ticket size={16} className="text-rose-400" />;
      case "EMPLOYEE": return <Contact size={16} className="text-emerald-400" />;
      case "PROJECT": return <Folder size={16} className="text-blue-400" />;
      default: return <Search size={16} className="text-zinc-400" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-sm transition-colors"
      >
        <Search size={14} />
        <span>Search...</span>
        <span className="text-xs bg-zinc-700 px-1.5 py-0.5 rounded text-zinc-400 ml-2">⌘K</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 mt-10 w-96 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-zinc-800 flex items-center space-x-3">
              <Search size={18} className="text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search across all modules..."
                className="flex-1 bg-transparent border-none text-zinc-100 placeholder-zinc-500 focus:outline-none text-sm"
              />
              {isLoading && <Loader2 size={16} className="text-indigo-500 animate-spin" />}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <div className="p-2 space-y-1">
                  {results.map(r => (
                    <a key={`${r.type}-${r.id}`} href={r.url} className="flex flex-col p-2 hover:bg-zinc-800 rounded-md transition-colors group cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 bg-zinc-950 rounded-md border border-zinc-800/50">
                          {getIcon(r.type)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-200 group-hover:text-indigo-400">{r.title}</span>
                          {r.subtitle && <span className="text-xs text-zinc-500">{r.subtitle}</span>}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : query.length >= 2 && !isLoading ? (
                <div className="p-6 text-center text-sm text-zinc-500">
                  No results found for "{query}"
                </div>
              ) : query.length < 2 ? (
                <div className="p-6 text-center text-sm text-zinc-600">
                  Type at least 2 characters to search
                </div>
              ) : null}
            </div>
            
            <div className="p-2 border-t border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
              <span className="text-[10px] uppercase font-semibold text-zinc-600 tracking-wider flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>Global Search Engine</span>
              </span>
              <span className="text-[10px] text-zinc-500">Press Esc to close</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
