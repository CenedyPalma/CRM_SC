import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomFieldsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(customObjectId: string, data: any) {
    return this.prisma.customField.create({
      data: {
        customObjectId,
        name: data.name,
        apiName: data.apiName,
        fieldType: data.fieldType,
        isRequired: data.isRequired || false,
        options: data.options || {}
      },
    });
  }

  async findAll(customObjectId: string) {
    return this.prisma.customField.findMany({
      where: { customObjectId }
    });
  }

  async findOne(customObjectId: string, id: string) {
    const field = await this.prisma.customField.findFirst({
      where: { id, customObjectId }
    });
    if (!field) throw new NotFoundException('Custom Field not found');
    return field;
  }

  async update(customObjectId: string, id: string, data: any) {
    const field = await this.findOne(customObjectId, id);
    return this.prisma.customField.update({
      where: { id: field.id },
      data,
    });
  }

  async remove(customObjectId: string, id: string) {
    const field = await this.findOne(customObjectId, id);
    return this.prisma.customField.delete({
      where: { id: field.id },
    });
  }
}
