import { getTenantHeaders } from "../../../lib/auth";
import { Database, Plus, Settings2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { CreateCustomObjectModal } from "../../../components/platform/CreateCustomObjectModal";

export const dynamic = 'force-dynamic';

async function getCustomObjects() {
  try {
    const res = await fetch('http://localhost:3008/custom-objects', {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch custom objects');
    return res.json();
  } catch (error) {
    console.error("Error fetching custom objects:", error);
    return [];
  }
}

export default async function PlatformObjectsPage() {
  const objects = await getCustomObjects();

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
            <Database className="text-indigo-500" size={24} />
            Schema Builder
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Design dynamic data models for your applications.</p>
        </div>
        <CreateCustomObjectModal />
      </div>

      {/* Content */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Object Name</th>
                <th className="px-6 py-4 font-medium">API Identifier</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Fields</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {objects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    <Database size={32} className="mx-auto mb-3 opacity-20" />
                    <p>No custom objects created yet.</p>
                    <p className="text-xs mt-1">Create one to start building your data model.</p>
                  </td>
                </tr>
              ) : objects.map((obj: any) => (
                <tr key={obj.id} className="hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/platform/objects/${obj.id}`} className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                      {obj.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-zinc-300">
                      {obj.apiName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{obj.description || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-zinc-800 text-zinc-300 rounded-full">
                      {obj.fields?.length || 0} fields
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/platform/objects/${obj.id}`} className="p-2 text-zinc-400 hover:text-white transition-colors inline-block">
                      <Settings2 size={16} />
                    </Link>
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
