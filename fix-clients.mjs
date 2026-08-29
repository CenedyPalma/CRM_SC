import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  { path: 'apps/web-core/src/app/login/page.tsx', replaces: [{ from: /http:\/\/localhost:3011/g, to: '/api/auth' }] },
  { path: 'apps/web-core/src/app/documents/DocumentsClient.tsx', replaces: [{ from: /http:\/\/localhost:3020/g, to: '/api/documents' }, { from: /headers:\s*\{\s*['"]x-tenant-id['"]:\s*['"]tenant-1['"]\s*\}/g, to: 'headers: {}' }] },
  { path: 'apps/web-core/src/app/super-admin/SuperAdminClient.tsx', replaces: [{ from: /http:\/\/localhost:3021/g, to: '/api/admin' }] },
  { path: 'apps/web-core/src/app/developer/DeveloperClient.tsx', replaces: [{ from: /http:\/\/localhost:3022/g, to: '/api/developer' }, { from: /headers:\s*\{\s*['"]x-tenant-id['"]:\s*['"]tenant-1['"]\s*\}/g, to: 'headers: {}' }] },
  { path: 'apps/web-core/src/app/chat/ChatClient.tsx', replaces: [{ from: /http:\/\/localhost:3014/g, to: '/api/chat' }] }
];

filesToUpdate.forEach(fileInfo => {
  const fullPath = path.join(process.cwd(), fileInfo.path);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;
  
  fileInfo.replaces.forEach(replace => {
    if (replace.from.test(content)) {
      content = content.replace(replace.from, replace.to);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated client component: ${fileInfo.path}`);
  }
});
