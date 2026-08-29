"use client";

import { useState } from "react";
import { Search, Filter, Shield, Activity, User, Globe, Download, Database } from "lucide-react";

export function AuditLogsClient({ initialLogs }: { initialLogs: any[] }) {
  const [logs, setLogs] = useState(initialLogs);
  const [filterAction, setFilterAction] = useState("");

  const filteredLogs = filterAction 
    ? logs.filter(log => log.action.toLowerCase().includes(filterAction.toLowerCase()))
    : logs;

  const getActionColor = (action: string) => {
    if (action.includes('DELETE') || action.includes('REMOVE')) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (action.includes('CREATE') || action.includes('REGISTER')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (action.includes('LOGIN') || action.includes('AUTH')) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
  };

  const getEntityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'auth': return <Shield size={14} />;
      case 'user': return <User size={14} />;
      case 'webhook': return <Globe size={14} />;
      default: return <Database size={14} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      
      {/* Header & Stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-white flex items-center space-x-2">
            <Activity size={20} className="text-indigo-400" />
            <span>System Audit Trail</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Immutable log of all critical mutations and access events.
          </p>
        </div>
        <button className="flex items-center space-x-2 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded-md text-sm font-medium transition-colors">
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search by action (e.g. LOGIN)..." 
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
        <button className="flex items-center space-x-2 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-md text-sm transition-colors">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50 flex-1 flex flex-col">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 sticky top-0">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Entity Type</th>
                <th className="px-6 py-4 font-medium">Entity ID</th>
                <th className="px-6 py-4 font-medium">Actor (User ID)</th>
                <th className="px-6 py-4 font-medium">IP / Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    No audit logs found.
                  </td>
                </tr>
              )}
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs text-zinc-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center space-x-2 text-zinc-400">
                      {getEntityIcon(log.entityType)}
                      <span>{log.entityType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-zinc-500">
                    {log.entityId || '-'}
                  </td>
                  <td className="px-6 py-3">
                    {log.userId ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
                          <User size={10} className="text-zinc-400" />
                        </div>
                        <span className="font-mono text-xs text-zinc-400">{log.userId}</span>
                      </div>
                    ) : (
                      <span className="text-zinc-600 font-mono text-xs">SYSTEM</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-zinc-500 font-mono text-xs">
                    192.168.1.1
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
