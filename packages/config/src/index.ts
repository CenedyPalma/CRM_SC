export const config = {
  appName: 'Business OS',
  version: '1.0.0',
  apiEndpoints: {
    crm: process.env.CRM_API_URL || 'http://localhost:3001',
    sales: process.env.SALES_API_URL || 'http://localhost:3002',
    automation: process.env.AUTOMATION_API_URL || 'http://localhost:3003',
  }
};
