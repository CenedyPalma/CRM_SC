import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomObjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.$transaction(async (tx) => {
      const customObject = await tx.customObject.create({
        data: {
          tenantId,
          name: data.name,
          pluralName: data.pluralName,
          apiName: data.apiName,
          description: data.description,
          icon: data.icon,
        },
      });

      if (data.fields && Array.isArray(data.fields)) {
        for (const field of data.fields) {
          await tx.customField.create({
            data: {
              customObjectId: customObject.id,
              name: field.name,
              apiName: field.apiName,
              fieldType: field.fieldType,
              isRequired: field.isRequired || false,
              options: field.options || null,
              defaultValue: field.defaultValue || null,
              isUnique: field.isUnique || false,
              isSearchable: field.isSearchable || false,
              validationRules: field.validationRules || null,
            },
          });
        }
      }

      return customObject;
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.customObject.findMany({
      where: { tenantId },
      include: { fields: true },
      orderBy: { name: 'asc' }
    });
  }

  async findOne(tenantId: string, id: string) {
    const object = await this.prisma.customObject.findFirst({
      where: { id, tenantId },
      include: { fields: true }
    });
    if (!object) throw new NotFoundException('Custom Object not found');
    return object;
  }

  async update(tenantId: string, id: string, data: any) {
    const object = await this.findOne(tenantId, id);
    
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.customObject.update({
        where: { id: object.id },
        data: {
          name: data.name,
          pluralName: data.pluralName,
          description: data.description,
          icon: data.icon,
        },
      });

      // Handle fields update if provided
      if (data.fields && Array.isArray(data.fields)) {
        // Simplified for this scope: in a real app we'd do a complex diff (upsert/delete)
        // Here we'll just allow adding new fields for now, or updating existing
        for (const field of data.fields) {
          if (field.id) {
            await tx.customField.update({
              where: { id: field.id },
              data: {
                name: field.name,
                isRequired: field.isRequired,
                options: field.options,
                defaultValue: field.defaultValue,
                isUnique: field.isUnique,
                isSearchable: field.isSearchable,
                validationRules: field.validationRules,
              }
            });
          } else {
            await tx.customField.create({
              data: {
                customObjectId: object.id,
                name: field.name,
                apiName: field.apiName,
                fieldType: field.fieldType,
                isRequired: field.isRequired || false,
                options: field.options || null,
                defaultValue: field.defaultValue || null,
                isUnique: field.isUnique || false,
                isSearchable: field.isSearchable || false,
                validationRules: field.validationRules || null,
              }
            });
          }
        }
      }
      return updated;
    });
  }

  async remove(tenantId: string, id: string) {
    const object = await this.findOne(tenantId, id);
    return this.prisma.customObject.delete({
      where: { id: object.id },
    });
  }

  // Seed Helper
  async seedDemoData(tenantId: string) {
    const properties = await this.prisma.customObject.create({
      data: {
        tenantId,
        name: 'Properties',
        apiName: 'properties',
        description: 'Real estate properties portfolio'
      }
    });

    await this.prisma.customField.createMany({
      data: [
        { customObjectId: properties.id, name: 'Address', apiName: 'address', fieldType: 'TEXT', isRequired: true },
        { customObjectId: properties.id, name: 'Price', apiName: 'price', fieldType: 'NUMBER', isRequired: true },
        { customObjectId: properties.id, name: 'Status', apiName: 'status', fieldType: 'TEXT', isRequired: false },
      ]
    });

    await this.prisma.customRecord.create({
      data: {
        tenantId,
        customObjectId: properties.id,
        data: { address: '123 Main St', price: 450000, status: 'Available' }
      }
    });
  }
}
