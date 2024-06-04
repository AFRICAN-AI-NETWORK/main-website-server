import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

const prisma = new PrismaClient();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bypassAuth = this.reflector.get<boolean>(
      'bypassAuth',
      context.getHandler(),
    );

    const token = this.extractTokenFromRequest(request);
    if (!token && !bypassAuth) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: payload.id },
      });

      request['user'] = user;
    } catch {
      if (!bypassAuth)
        throw new UnauthorizedException('Malformed or expired token provided');
    }

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
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.user?.role !== '')
      throw new UnauthorizedException(
        'You do not have access to perform this action',
      );

    return true;
  }
}
