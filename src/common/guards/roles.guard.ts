import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-express';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  roles: string[];
  user;

  getRequest(context: ExecutionContext) {
    const cxt = GqlExecutionContext.create(context);
    const request = cxt.getContext().req;
    this.roles = this.reflector.get<string[]>('roles', context.getHandler());
    return request;
  }

  handleRequest(err: any, user: any, info: any) {
    if (!this.roles) {
      return true;
    }

    if (err || !user || !this.roles.includes(user.role)) {
      throw (
        err || new AuthenticationError('You do not have permission (Roles)')
      );
    }
    this.user = user;
    return user;
  }
}
