import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role as RoleEnum } from '@prisma/client';
import { Request } from 'express';
import { Role } from '../auth/auth.decorator';
import { AuthGuard, RoleGuard } from '../auth/auth.guard';
import {
  CreateAiToolCategoryDto,
  CreateAiToolDto,
  UpdateAiToolCategoryDto,
  UpdateAiToolDto,
} from './ai-tools.dto';
import { AiToolsService } from './ai-tools.service';

@ApiTags('ai-tools')
@Controller('ai-tools')
export class AiToolsController {
  constructor(private readonly aiToolsService: AiToolsService) {}

  @Get('categories')
  getAiToolsCategories() {
    return this.aiToolsService.getAiToolsCategories();
  }

  @Get('categories/:id')
  getAiToolsCategoryById(@Param('id') id: string) {
    return this.aiToolsService.getAiToolsCategoryById(id);
  }

  @Post('/categories')
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  createAiToolsCategory(
    @Body() dto: CreateAiToolCategoryDto,
    @Req() request: Request,
  ) {
    return this.aiToolsService.createAiToolsCategory(request.user?.id, dto);
  }

  @Patch('/categories/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  updateAiToolsCategory(
    @Param('id') id: string,
    @Body() dto: UpdateAiToolCategoryDto,
  ) {
    return this.aiToolsService.updateAiToolsCategory(id, dto);
  }

  @Delete('/categories/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  deleteAiToolsCategory(@Param('id') id: string, @Req() request: Request) {
    return this.aiToolsService.deleteAiToolsCategory(request.user?.id, id);
  }

  @Get()
  getAiTools() {
    return this.aiToolsService.getAiTools();
  }

  @Get(':id')
  getAiToolById(@Param('id') id: string) {
    return this.aiToolsService.getAiToolById(id);
  }

  @Get(':slug')
  getAiToolBySlug(@Param('slug') slug: string) {
    return this.aiToolsService.getAiToolBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  addAiTool(@Body() dto: CreateAiToolDto, @Req() request: Request) {
    return this.aiToolsService.addAiTool(request.user?.id, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  async updateAiTool(@Param('id') id: string, @Body() dto: UpdateAiToolDto) {
    return this.aiToolsService.updateAiTool(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  async deleteAiTool(@Param('id') id: string) {
    return this.aiToolsService.deleteAiTool(id);
  }
}
