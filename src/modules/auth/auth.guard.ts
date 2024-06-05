import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    let payload: { id: string } | undefined;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Malformed or expired token provided');
    }

    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: payload.id },
    });
    if (!user.emailVerified)
      throw new UnauthorizedException('User not verified');

    request['user'] = user;

    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    // Extract token from Authorization header
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.user)
      throw new UnauthorizedException(
        'You do not have access to perform this action',
      );

    const role = this.reflector.get<Role>('role', context.getHandler());

    if (request.user.role === Role.SUPERADMIN) return true;

    if (request.user.role === role) {
      if (!request.user.approved)
        throw new UnauthorizedException('User not approved');
      return true;
    }

    return false;
  }
}
