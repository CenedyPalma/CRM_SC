import { Prisma, PrismaClient } from '@prisma/client';

export function applyAuditMiddleware(prisma: PrismaClient) {
  prisma.$use(async (params, next) => {
    const result = await next(params);
    
    // Only log mutations
    if (['create', 'update', 'delete', 'createMany', 'updateMany', 'deleteMany'].includes(params.action)) {
      // Don't recursively audit the AuditLog table
      if (params.model === 'AuditLog') {
        return result;
      }
      
      const args = params.args || {};
      const data = args.data || {};
      
      // Extract tenantId
      let tenantId = data.tenantId;
      if (!tenantId && args.where && args.where.tenantId) {
        tenantId = args.where.tenantId;
      }
      if (!tenantId) {
        tenantId = 'system';
      }

      // Extract entity ID if possible
      let entityId = result?.id;
      if (!entityId && args.where && args.where.id) {
        entityId = args.where.id;
      }
      
      try {
        // Run audit logging asynchronously without blocking the main request
        prisma.auditLog.create({
          data: {
            tenantId,
            action: `${params.model?.toUpperCase()}_${params.action.toUpperCase()}`,
            entityType: params.model || 'Unknown',
            entityId: entityId || 'unknown',
            metadata: {
              args: params.args,
            },
          }
        }).catch(err => {
          console.error('Failed to write audit log:', err.message);
        });
      } catch (err) {
        console.error('Failed to schedule audit log:', (err as Error).message);
      }
    }
    
    return result;
  });
}
