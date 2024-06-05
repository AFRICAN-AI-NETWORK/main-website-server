import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role as RoleEnum } from '@prisma/client';
import { Request } from 'express';
import { Role } from '../auth/auth.decorator';
import { AuthGuard, RoleGuard } from '../auth/auth.guard';
import {
  BadRequestErrorResponseEntity,
  InternalServerErrorResponseEntity,
  NotFoundResponseEntity,
  ResponseEntity,
} from '../core/core.entity';
import { UpdateUserProfileDto, UpdateUserRoleDto } from './users.dto';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'Returns all users',
    type: [UserEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
    type: InternalServerErrorResponseEntity,
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.SUPERADMIN)
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('/users/:id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({
    description: 'Returns user by id',
    type: UserEntity,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: NotFoundResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
    type: InternalServerErrorResponseEntity,
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.SUPERADMIN)
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch('/users')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiOkResponse({
    description: 'Returns the updated user information',
    type: UserEntity,
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
    type: InternalServerErrorResponseEntity,
  })
  @UseGuards(AuthGuard)
  updateUserProfile(
    @Body() dto: UpdateUserProfileDto,
    @Req() request: Request,
  ) {
    return this.usersService.updateUserProfile(request.user.id, dto);
  }

  @Patch('/users/role/:id')
  @ApiOperation({ summary: 'Update user role (superadmin only)' })
  @ApiOkResponse({
    description: 'User role updated successfully',
    type: ResponseEntity,
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorResponseEntity,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: NotFoundResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
    type: InternalServerErrorResponseEntity,
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.SUPERADMIN)
  updateUserRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
    @Req() request: Request,
  ) {
    if (request.user.id === id)
      throw new BadRequestException('Cannot change own role');

    return this.usersService.updateUserRole(id, dto.role);
  }

  @Patch('/users/approve/:id')
  @ApiOperation({
    summary: 'Approve admin (superadmin only)',
    description:
      "Users who sign up as admin/superadmin need to be verified by the superadmin before they'll be able to access admin resources",
  })
  @ApiOkResponse({
    description: 'Admin approved successfully',
    type: ResponseEntity,
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorResponseEntity,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: NotFoundResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
    type: InternalServerErrorResponseEntity,
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.SUPERADMIN)
  approveAdmin(@Param('id') id: string, @Req() request: Request) {
    if (request.user.id === id) throw new BadRequestException('Invalid action');

    return this.usersService.approveAdmin(id);
  }

  @Delete('/users/me')
  @ApiOperation({ summary: 'Delete my account' })
  @ApiNoContentResponse({
    description: 'User deleted successfully',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
    type: InternalServerErrorResponseEntity,
  })
  @UseGuards(AuthGuard)
  deleteMyAccount(@Req() request: Request) {
    return this.usersService.deleteUser(request.user.id);
  }

  @Delete('/users/:id')
  @ApiOperation({ summary: 'Delete a user (superadmin only)' })
  @ApiNoContentResponse({
    description: 'User deleted successfully',
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorResponseEntity,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: NotFoundResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
    type: InternalServerErrorResponseEntity,
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Role(RoleEnum.SUPERADMIN)
  deleteUser(@Param('id') id: string, @Req() request: Request) {
    if (request.user.id === id)
      throw new BadRequestException('Cannot delete yourself');

    return this.usersService.deleteUser(id);
  }
}
