import { AuthGuard } from '@nestjs/passport';
import { Injectable, SetMetadata } from '@nestjs/common';

import type { Observable } from 'rxjs';
import type { Reflector } from '@nestjs/core';
import type {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
} from '@nestjs/common';

import type { User } from 'db/models/User';
import type { IRequestProps } from 'api/auth/interface';

export const ROLES_KEY = 'roles';
const IS_PUBLIC_KEY = 'isPublic';

export function Public(): CustomDecorator<string> {
  return SetMetadata(IS_PUBLIC_KEY, true);
}

export function Roles(...roles: User['role'][]): CustomDecorator<string> {
  return SetMetadata(ROLES_KEY, roles);
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<IRequestProps>();
    const user = request.user;

    return roles.includes(user.role);
  }
}
