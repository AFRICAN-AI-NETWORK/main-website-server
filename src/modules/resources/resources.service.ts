import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getResourcesCategories() {}
  async getResourcesCategoryById(id: string) {}
  async createResourcesCategory(userId: string, dto: any) {}
  async updateResourcesCategory(userId: string, categoryId: string, dto: any) {}
  async deleteResourcesCategory(userId: string, categoryId: string) {}

  async getResources() {}
  async getResourceById(id: string) {}
  async getResourceBySlug(slug: string) {}
  async addResource(userId: string, dto: any) {}
  async updateResource(userId: string, toolId: string, dto: any) {}
  async deleteResource(userId: string, toolId: string) {}
}
