import fs from 'fs';
import path from 'path';

const files = [
'apps/web-core/src/app/deals/page.tsx',
'apps/web-core/src/app/chat/page.tsx',
'apps/web-core/src/app/audit-logs/page.tsx',
'apps/web-core/src/app/documents/page.tsx',
'apps/web-core/src/app/platform/schema/page.tsx',
'apps/web-core/src/app/platform/objects/[id]/page.tsx',
'apps/web-core/src/app/platform/objects/page.tsx',
'apps/web-core/src/app/platform/ai/page.tsx',
'apps/web-core/src/app/projects/page.tsx',
'apps/web-core/src/app/directory/page.tsx',
'apps/web-core/src/app/tickets/page.tsx',
'apps/web-core/src/app/invoices/page.tsx',
'apps/web-core/src/app/developer/page.tsx',
'apps/web-core/src/app/dashboard/page.tsx',
'apps/web-core/src/app/page.tsx',
'apps/web-core/src/app/marketplace/page.tsx',
'apps/web-core/src/app/automations/page.tsx'
];

files.forEach(f => {
  const fullPath = path.join(process.cwd(), f);
  if (!fs.existsSync(fullPath)) return;
  const content = fs.readFileSync(fullPath, 'utf8');
  if (!content.includes('getTenantHeaders')) return;
  
  // count how many directories up we are
  const relLevels = f.split('/').length - 4; // apps/web-core/src/app = 4
  const prefix = '../'.repeat(relLevels) || './';
  
  const newContent = `import { getTenantHeaders } from "${prefix}lib/auth";\n` + content;
  fs.writeFileSync(fullPath, newContent, 'utf8');
  console.log('Fixed ' + f);
});
