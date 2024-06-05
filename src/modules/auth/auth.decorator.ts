import { SetMetadata } from '@nestjs/common';
import { Role as RoleEnum } from '@prisma/client';

export const BypassAuth = () => SetMetadata('bypassAuth', true);
export const Role = (role: RoleEnum) => SetMetadata('role', role);
