import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserProfileDto } from './users.dto';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers(): Promise<UserEntity[]> {
    const users = await this.prismaService.user.findMany();

    return users.map((user) => new UserEntity(user));
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    return new UserEntity(user);
  }

  async updateUserProfile(
    userId: string,
    dto: UpdateUserProfileDto,
  ): Promise<UserEntity> {
    let user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        ...dto,
      },
    });
    return new UserEntity(user);
  }

  async updateUserRole(userId: string, role: Role) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.prismaService.user.update({
      where: { id: userId },
      data: { role },
    });

    return {
      message: 'User role updated successfully',
    };
  }

  async approveAdmin(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== Role.ADMIN)
      throw new BadRequestException('User is not an admin');

    await this.prismaService.user.update({
      where: { id: userId },
      data: { approved: true },
    });

    return {
      message: 'Admin approved successfully',
    };
  }

  async deleteUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === Role.SUPERADMIN) {
      const count = await this.prismaService.user.count({
        where: { role: Role.SUPERADMIN },
      });
      if (count === 1)
        throw new BadRequestException('Cannot delete last superadmin');
    }

    await this.prismaService.user.delete({ where: { id: userId } });
  }
}
