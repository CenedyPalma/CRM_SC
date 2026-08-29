"use client";

import { useState } from "react";
import { Key, Webhook, Plus, Trash2, Power, Code2, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeveloperClient({ initialApiKeys, initialWebhooks }: { initialApiKeys: any[], initialWebhooks: any[] }) {
  const [activeTab, setActiveTab] = useState<'api' | 'webhooks'>('api');
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [webhooks, setWebhooks] = useState(initialWebhooks);
  const [newKeyRaw, setNewKeyRaw] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleGenerateKey = async () => {
    const name = prompt("Name this API Key (e.g. Zapier Integration):");
    if (!name) return;
    
    const res = await fetch(`/api/developer/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': 'default-tenant'
      },
      body: JSON.stringify({ name })
    });
    
    if (res.ok) {
      const newKey = await res.json();
      setNewKeyRaw(newKey.key); // Show the raw key once
      
      // Update local state with masked key for the list
      const maskedKey = { ...newKey, key: newKey.key.substring(0, 12) + '... (Masked for security)' };
      setApiKeys([maskedKey, ...apiKeys]);
      router.refresh();
    }
  };

  const handleRegisterWebhook = async () => {
    const url = prompt("Enter Webhook Endpoint URL:");
    if (!url) return;
    
    const eventsStr = prompt("Enter comma separated events (e.g. contact.created,deal.won):", "contact.created");
    if (!eventsStr) return;
    
    const events = eventsStr.split(',').map(e => e.trim());
    
    const res = await fetch(`/api/developer/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': 'default-tenant'
      },
      body: JSON.stringify({ url, events })
    });
    
    if (res.ok) {
      const newWebhook = await res.json();
      setWebhooks([newWebhook, ...webhooks]);
      router.refresh();
    }
  };

  const copyToClipboard = () => {
    if (newKeyRaw) {
      navigator.clipboard.writeText(newKeyRaw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      
      {/* Tabs */}
      <div className="flex border-b border-zinc-800 mb-6">
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center space-x-2 transition-colors ${activeTab === 'api' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-300'}`}
        >
          <Key size={16} />
          <span>API Keys</span>
        </button>
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center space-x-2 transition-colors ${activeTab === 'webhooks' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-300'}`}
        >
          <Webhook size={16} />
          <span>Webhooks</span>
        </button>
      </div>

      {newKeyRaw && (
        <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-emerald-400 font-medium text-sm flex items-center space-x-2">
                <CheckCircle2 size={16} /> <span>API Key Generated Successfully</span>
              </h3>
              <p className="text-zinc-400 text-xs mt-1">
                Please copy this key and store it securely. You will not be able to see it again.
              </p>
              <div className="mt-3 flex items-center space-x-3">
                <code className="px-3 py-1.5 bg-zinc-900 rounded font-mono text-zinc-300 text-sm border border-zinc-800">
                  {newKeyRaw}
                </code>
                <button 
                  onClick={copyToClipboard}
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors flex items-center space-x-1 text-xs"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <button onClick={() => setNewKeyRaw(null)} className="text-zinc-500 hover:text-zinc-300">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'api' ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-400">Manage API keys for server-to-server integrations.</p>
              <button 
                onClick={handleGenerateKey}
                className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                <span>Create Secret Key</span>
              </button>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Secret Key</th>
                    <th className="px-6 py-3 font-medium">Created</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {apiKeys.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                        No API keys generated yet.
                      </td>
                    </tr>
                  )}
                  {apiKeys.map(key => (
                    <tr key={key.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-3 font-medium text-zinc-200 flex items-center space-x-2">
                        <Key size={14} className="text-zinc-500" />
                        <span>{key.name}</span>
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-zinc-500">{key.key}</td>
                      <td className="px-6 py-3 text-zinc-400">{new Date(key.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3 text-right">
                        <button className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition-colors" title="Revoke Key">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
             <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-400">Register endpoints to receive real-time event payloads.</p>
              <button 
                onClick={handleRegisterWebhook}
                className="flex items-center space-x-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                <span>Add Endpoint</span>
              </button>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">URL</th>
                    <th className="px-6 py-3 font-medium">Events</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {webhooks.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                        No webhooks registered.
                      </td>
                    </tr>
                  )}
                  {webhooks.map(webhook => (
                    <tr key={webhook.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-3 font-medium text-indigo-400 flex items-center space-x-2">
                        <Code2 size={14} className="text-zinc-500" />
                        <span>{webhook.url}</span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.map((e: string, i: number) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono">
                              {e}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        {webhook.isActive ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-400 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-zinc-500 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                            <span>Disabled</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end space-x-2">
                          <button className={`p-1.5 rounded transition-colors ${webhook.isActive ? 'text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`} title="Toggle Status">
                            <Power size={14} />
                          </button>
                          <button className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckCircle2({ size }: { size: number }) {
  return <Check size={size} />;
}
