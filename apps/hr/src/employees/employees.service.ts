import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findEmployees(tenantId: string) {
    return this.prisma.employee.findMany({
      where: { tenantId },
      include: {
        department: true,
        leaveRequests: {
          orderBy: { startDate: 'desc' },
          take: 5
        }
      },
      orderBy: { firstName: 'asc' }
    });
  }

  async createEmployee(tenantId: string, data: { firstName: string, lastName: string, email: string, jobTitle?: string, departmentId?: string }) {
    return this.prisma.employee.create({
      data: {
        tenantId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        jobTitle: data.jobTitle,
        departmentId: data.departmentId
      }
    });
  }

  async findLeaveRequests(tenantId: string) {
    return this.prisma.leaveRequest.findMany({
      where: { tenantId },
      include: {
        employee: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async requestLeave(tenantId: string, data: { employeeId: string, type: string, startDate: string, endDate: string, reason?: string }) {
    return this.prisma.leaveRequest.create({
      data: {
        tenantId,
        employeeId: data.employeeId,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        reason: data.reason,
        status: 'PENDING'
      }
    });
  }

  async updateLeaveStatus(id: string, status: string) {
    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status }
    });
  }

  // Seed Helper
  async seedDemoData(tenantId: string) {
    const devDept = await this.prisma.department.create({ data: { tenantId, name: 'Engineering' } });
    const hrDept = await this.prisma.department.create({ data: { tenantId, name: 'Human Resources' } });
    
    const emp1 = await this.createEmployee(tenantId, { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', jobTitle: 'Senior Engineer', departmentId: devDept.id });
    const emp2 = await this.createEmployee(tenantId, { firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com', jobTitle: 'HR Manager', departmentId: hrDept.id });
    
    await this.requestLeave(tenantId, { employeeId: emp1.id, type: 'VACATION', startDate: '2026-09-01T00:00:00Z', endDate: '2026-09-10T00:00:00Z', reason: 'Family trip' });
    const leave2 = await this.requestLeave(tenantId, { employeeId: emp2.id, type: 'SICK', startDate: '2026-08-01T00:00:00Z', endDate: '2026-08-02T00:00:00Z' });
    await this.updateLeaveStatus(leave2.id, 'APPROVED');
  }
}
