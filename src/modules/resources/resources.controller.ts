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
import { ResourcesService } from './resources.service';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('categories')
  getResourcesCategories() {
    return this.resourcesService.getResourcesCategories();
  }

  @Get('categories/:id')
  getResourcesCategoryById(@Param('id') id: string) {
    return this.resourcesService.getResourcesCategoryById(id);
  }

  @Post('/categories')
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  createResourcesCategory(@Body() dto: any, @Req() request: Request) {
    return this.resourcesService.createResourcesCategory(request.user?.id, dto);
  }

  @Patch('/categories/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  updateResourcesCategory(
    @Param('id') id: string,
    @Body() dto: any,
    @Req() request: Request,
  ) {
    return this.resourcesService.updateResourcesCategory(
      request.user?.id,
      id,
      dto,
    );
  }

  @Delete('/categories/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  deleteResourcesCategory(@Param('id') id: string, @Req() request: Request) {
    return this.resourcesService.deleteResourcesCategory(request.user?.id, id);
  }

  @Get()
  getResources() {
    return this.resourcesService.getResources();
  }

  @Get(':id')
  getResourceById(@Param('id') id: string) {
    return this.resourcesService.getResourceById(id);
  }

  @Get(':slug')
  getResourceBySlug(@Param('slug') slug: string) {
    return this.resourcesService.getResourceBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  addResource(@Body() dto: any, @Req() request: Request) {
    return this.resourcesService.addResource(request.user?.id, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  async updateResource(
    @Param('id') id: string,
    @Body() dto: any,
    @Req() request: Request,
  ) {
    return this.resourcesService.updateResource(request.user?.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  async deleteResource(@Param('id') id: string, @Req() request: Request) {
    return this.resourcesService.deleteResource(request.user?.id, id);
  }
}
