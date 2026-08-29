"use client";

import { useState } from "react";
import { Building2, Search, Plus, MoreVertical, Settings, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function SuperAdminClient({ initialTenants }: { initialTenants: any[] }) {
  const [tenants, setTenants] = useState(initialTenants);
  const router = useRouter();

  const handleProvisionTenant = async () => {
    const name = prompt("Enter new Business Name (Tenant):");
    if (!name) return;
    
    const res = await fetch(`/api/admin/tenants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name })
    });
    
    if (res.ok) {
      const newTenant = await res.json();
      setTenants([newTenant, ...tenants]);
      router.refresh();
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-sm font-medium">Total Tenants</p>
            <p className="text-2xl font-bold text-white mt-1">{tenants.length}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center">
            <Building2 size={24} className="text-indigo-400" />
          </div>
        </div>
        
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-sm font-medium">System Health</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">100%</p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 size={24} className="text-emerald-400" />
          </div>
        </div>

        <div className="p-5 bg-rose-950/20 border border-rose-900/30 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-rose-400/70 text-sm font-medium">Security Alerts</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">0</p>
          </div>
          <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center">
            <ShieldAlert size={24} className="text-rose-400" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search businesses..." 
            className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-80 transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm font-medium transition-colors border border-zinc-700">
            <Settings size={16} />
            <span>Global Settings</span>
          </button>
          <button 
            onClick={handleProvisionTenant}
            className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            <span>Provision Tenant</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50 flex-1 flex flex-col">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 sticky top-0">
              <tr>
                <th className="px-6 py-4 font-medium">Tenant ID</th>
                <th className="px-6 py-4 font-medium">Business Name</th>
                <th className="px-6 py-4 font-medium">Domain</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium">Users</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {tenants.map(tenant => (
                <tr key={tenant.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{tenant.id}</td>
                  <td className="px-6 py-4 font-medium text-zinc-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                        {tenant.name.charAt(0)}
                      </div>
                      <span>{tenant.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-indigo-400 font-mono text-xs hover:underline cursor-pointer">{tenant.domain}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    {new Date(tenant.createdAt || new Date()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {tenant._count?.users || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors">
                      <MoreVertical size={16} />
                    </button>
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
