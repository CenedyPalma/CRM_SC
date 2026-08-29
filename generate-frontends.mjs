import fs from 'fs';
import path from 'path';

const pages = [
  { path: 'subscriptions', title: 'Subscriptions', apiPort: 3006 },
  { path: 'payment-links', title: 'Payment Links', apiPort: 3006 },
  { path: 'quotes', title: 'Quotes', apiPort: 3006 },
  { path: 'price-books', title: 'Price Books', apiPort: 3006 },
  
  { path: 'slas', title: 'SLAs', apiPort: 3003 },
  { path: 'chat-widgets', title: 'Chat Widgets', apiPort: 3003 },
  
  { path: 'offer-letters', title: 'Offer Letters', apiPort: 3005 },
  { path: 'ndas', title: 'NDAs', apiPort: 3005 },
  { path: 'onboarding', title: 'Onboarding Tasks', apiPort: 3005 },
  
  { path: 'search-index', title: 'Search Index', apiPort: 3010 },
  { path: 'reports', title: 'Report Templates', apiPort: 3004 },
  
  { path: 's3-uploads', title: 'S3 Uploads', apiPort: 3009 },
  { path: 'e-signatures', title: 'E-Signatures', apiPort: 3009 },
  
  { path: 'localization', title: 'Localization', apiPort: 3011 },
  { path: 'taxes', title: 'Tax Rules', apiPort: 3011 },
  { path: 'compliance', title: 'Compliance Policies', apiPort: 3012 }
];

pages.forEach(({ path: routePath, title, apiPort }) => {
  const dir = `apps/web-core/app/${routePath}`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const pageCode = `
import { getTenantHeaders } from '@/lib/auth';

export default async function ${title.replace(/[-\s]+/g, '')}Page() {
  const headers = await getTenantHeaders();
  const res = await fetch('http://localhost:${apiPort}/${routePath}', {
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
        <h1 className="text-3xl font-bold">${title}</h1>
      </div>
      
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No ${title.toLowerCase()} found.
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
`;

  fs.writeFileSync(dir + '/page.tsx', pageCode);
  console.log('Generated frontend for ' + routePath);
});
