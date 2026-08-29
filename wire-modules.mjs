import fs from 'fs';
import path from 'path';

const apps = [
  { app: 'finance', modules: ['subscriptions', 'payment-links', 'quotes', 'price-books'] },
  { app: 'helpdesk', modules: ['slas', 'chat-widgets'] },
  { app: 'hr', modules: ['offer-letters', 'ndas', 'onboarding'] },
  { app: 'search', modules: ['search-index'] },
  { app: 'bi-engine', modules: ['reports'] },
  { app: 'documents', modules: ['s3-uploads', 'e-signatures'] },
  { app: 'settings', modules: ['localization', 'taxes'] },
  { app: 'audit', modules: ['compliance'] }
];

apps.forEach(({ app, modules }) => {
  const appModulePath = `apps/${app}/src/app.module.ts`;
  if (!fs.existsSync(appModulePath)) return;

  let content = fs.readFileSync(appModulePath, 'utf8');

  modules.forEach(mod => {
    const servicePath = `apps/${app}/src/${mod}/${mod}.service.ts`;
    if (!fs.existsSync(servicePath)) return;
    
    const serviceContent = fs.readFileSync(servicePath, 'utf8');
    const match = serviceContent.match(/export class (\w+)Service/);
    if (!match) return;
    
    const className = match[1];

    if (!content.includes(`${className}Controller`)) {
      const importStatement = `import { ${className}Controller } from './${mod}/${mod}.controller';\nimport { ${className}Service } from './${mod}/${mod}.service';\n`;
      
      content = importStatement + content;
      content = content.replace(/controllers:\s*\[/, `controllers: [${className}Controller, `);
      content = content.replace(/providers:\s*\[/, `providers: [${className}Service, `);
    }
  });

  fs.writeFileSync(appModulePath, content);
  console.log(`Updated ${appModulePath}`);
});
