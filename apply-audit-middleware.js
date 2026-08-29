import fs from 'fs';
import path from 'path';

const appsDir = path.join(process.cwd(), 'apps');
const apps = fs.readdirSync(appsDir).filter(f => fs.statSync(path.join(appsDir, f)).isDirectory());

let updatedCount = 0;

for (const app of apps) {
  // Ignore web-core since it doesn't have a PrismaService backend
  if (app === 'web-core') continue;
  
  const prismaServicePath = path.join(appsDir, app, 'src', 'prisma', 'prisma.service.ts');
  
  if (fs.existsSync(prismaServicePath)) {
    let content = fs.readFileSync(prismaServicePath, 'utf8');
    
    // Check if applyAuditMiddleware is already imported
    if (!content.includes('applyAuditMiddleware')) {
      // Add import
      content = content.replace(
        "import { PrismaClient } from '@repo/database';",
        "import { PrismaClient, applyAuditMiddleware } from '@repo/database';"
      );
      
      // Inject applyAuditMiddleware in constructor or onModuleInit
      if (content.includes('async onModuleInit() {')) {
        content = content.replace(
          'async onModuleInit() {',
          'constructor() {\n    super();\n    applyAuditMiddleware(this);\n  }\n\n  async onModuleInit() {'
        );
        fs.writeFileSync(prismaServicePath, content, 'utf8');
        console.log(`Updated ${prismaServicePath}`);
        updatedCount++;
      }
    }
  }
}

console.log(`\nSuccess: Applied audit middleware to ${updatedCount} microservices.`);
