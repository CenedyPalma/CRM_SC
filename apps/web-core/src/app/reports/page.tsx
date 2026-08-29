
import { getTenantHeaders } from '@/lib/auth';

export default async function ReportTemplatesPage() {
  const headers = await getTenantHeaders();
  const res = await fetch('http://localhost:3004/reports', {
    headers,
    cache: 'no-store'
  });
  
  let items = [];
  if (res.ok) {
    items = await res.json();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Report Templates</h1>
      </div>
      
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No report templates found.
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono text-xs">{item.id}</td>
                  <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
