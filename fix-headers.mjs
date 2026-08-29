import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, 'apps/web-core/src/app');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (f === 'node_modules' || f === '.next') return;
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const headerRegex = /headers:\s*\{\s*["']x-tenant-id["']:\s*["'](default-tenant|tenant-1)["']\s*\}/g;
const fetchRegex = /fetch\(([^,]+),\s*\{\s*cache:\s*['"]no-store['"],\s*headers:\s*\{\s*['"]x-tenant-id['"]:\s*['"](default-tenant|tenant-1)['"]\s*\}\s*\}\)/g;

walkDir(directory, (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Handle the single fetch cases with cache: no-store
  if (fetchRegex.test(content)) {
    content = content.replace(fetchRegex, 'fetch($1, { cache: "no-store", headers: await getTenantHeaders() })');
    changed = true;
  }

  // Handle the generic headers object
  if (headerRegex.test(content)) {
    content = content.replace(headerRegex, 'headers: await getTenantHeaders()');
    changed = true;
  }
  
  // If we replaced something, ensure getTenantHeaders is imported
  if (changed && !content.includes('getTenantHeaders')) {
    // find relative path to lib/auth
    const relativePath = path.relative(path.dirname(filePath), path.join(__dirname, 'apps/web-core/src/lib/auth'));
    const importPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
    content = `import { getTenantHeaders } from '${importPath}';\n` + content;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
});
