import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAiToolCategoryDto,
  CreateAiToolDto,
  UpdateAiToolCategoryDto,
  UpdateAiToolDto,
} from './ai-tools.dto';

@Injectable()
export class AiToolsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAiToolsCategories() {
    return this.prismaService.aiToolCategory.findMany({
      include: { author: true },
    });
  }

  async getAiToolsCategoryById(id: string) {
    const category = await this.prismaService.aiToolCategory.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async createAiToolsCategory(userId: string, dto: CreateAiToolCategoryDto) {
    const categoryExists = await this.prismaService.aiToolCategory.findUnique({
      where: { title: dto.title },
    });
    if (categoryExists)
      throw new BadRequestException('AI Tool Category already exists');

    return this.prismaService.aiToolCategory.create({
      data: {
        ...dto,
        author: { connect: { id: userId } },
      },
    });
  }

  async updateAiToolsCategory(
    categoryId: string,
    dto: UpdateAiToolCategoryDto,
  ) {
    const aiToolCategory = await this.prismaService.aiToolCategory.findUnique({
      where: { id: categoryId },
    });
    if (!aiToolCategory)
      throw new NotFoundException('AI Tool Category not found');

    return this.prismaService.aiToolCategory.update({
      where: { id: categoryId },
      data: dto,
    });
  }

  async deleteAiToolsCategory(userId: string, categoryId: string) {
    const aiToolCategory = await this.prismaService.aiToolCategory.findUnique({
      where: { id: categoryId },
    });
    if (!aiToolCategory)
      throw new NotFoundException('AI Tool Category not found');

    await this.prismaService.aiToolCategory.delete({
      where: { id: categoryId },
    });
  }

  async getAiTools() {
    return this.prismaService.aiTool.findMany({ include: { author: true } });
  }

  async getAiToolById(id: string) {
    return this.prismaService.aiTool.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  async getAiToolBySlug(slug: string) {
    const aiTool = await this.prismaService.aiTool.findUnique({
      where: { slug },
      include: { author: true },
    });
    if (!aiTool) throw new NotFoundException('AI Tool not found');

    return aiTool;
  }

  async addAiTool(userId: string, dto: CreateAiToolDto) {
    const aiTool = await this.prismaService.aiTool.create({
      data: {
        ...dto,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return aiTool;
  }

  async updateAiTool(toolId: string, dto: UpdateAiToolDto) {
    const aiTool = await this.prismaService.aiTool.findUnique({
      where: { id: toolId },
    });
    if (!aiTool) throw new NotFoundException('AI Tool not found');

    return this.prismaService.aiTool.update({
      where: { id: toolId },
      data: {
        ...dto,
      },
    });
  }

  async deleteAiTool(toolId: string) {
    const aiTool = await this.prismaService.aiTool.findUnique({
      where: { id: toolId },
    });
    if (!aiTool) throw new NotFoundException('AI Tool not found');

    await this.prismaService.aiTool.delete({
      where: { id: toolId },
    });
  }
}
