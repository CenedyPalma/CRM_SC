import { getTenantHeaders } from "../../../lib/auth";
import { Brain, Bot, FileText, Database } from "lucide-react";
import { CreatePromptModal } from "../../../components/platform/ai/CreatePromptModal";
import { CreateKnowledgeModal } from "../../../components/platform/ai/CreateKnowledgeModal";

export const dynamic = 'force-dynamic';

async function getPrompts() {
  try {
    const res = await fetch('http://localhost:3010/prompts', {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

async function getKnowledge() {
  try {
    const res = await fetch('http://localhost:3010/knowledge', {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export default async function AIEnginePage() {
  const [prompts, knowledge] = await Promise.all([getPrompts(), getKnowledge()]);

  return (
    <div className="h-full flex flex-col space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Brain className="text-indigo-500" size={24} />
          AI Engine
        </h1>
        <p className="text-sm text-zinc-400 mt-1">Manage AI Prompts and your vector Knowledge Base.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        
        {/* Prompts Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Bot className="text-zinc-400" size={18} />
              Prompt Templates
            </h2>
            <CreatePromptModal />
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-zinc-900 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Model</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {prompts.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-12 text-center text-zinc-500">
                        <p>No prompts configured.</p>
                      </td>
                    </tr>
                  ) : prompts.map((p: any) => (
                    <tr key={p.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-indigo-400">{p.name}</span>
                        <div className="text-xs text-zinc-500 mt-1 line-clamp-1 font-mono">{p.prompt}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700">
                          {p.model}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Knowledge Base Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Database className="text-zinc-400" size={18} />
              Knowledge Base
            </h2>
            <CreateKnowledgeModal />
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-zinc-900 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Document Title</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {knowledge.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-12 text-center text-zinc-500">
                        <p>Knowledge base is empty.</p>
                      </td>
                    </tr>
                  ) : knowledge.map((doc: any) => (
                    <tr key={doc.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-white flex items-center gap-2">
                          <FileText size={14} className="text-zinc-400" />
                          {doc.title}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-900/50 rounded-full">
                          Embedded
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
