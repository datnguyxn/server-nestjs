import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { User } from '../../interfaces/user.interface';
import { UserRolesShared } from '../../shared/user-roles.shared';
import { AuthModel } from '../../model/auth.model';
import { Payload } from '../../interfaces/payload.interface';
import { ResponseError, ResponseSuccess } from '../../dto/response.dto';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation((returns) => AuthModel)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = {
      email,
      password,
      userRole: UserRolesShared.NORMAL,
    } as User;
    try {
      const response = (await this.userService.create(user)) as User;
      const payload: Payload = {
        email: response.email,
        role: response.userRole,
      };

      const token = this.authService.signPayload(payload);
      return new ResponseSuccess('User created', {
        email: response.email,
        token,
      });
    } catch (e) {
      return new ResponseError('Error creating user', e);
    }
  }

  @Mutation(returns => AuthModel)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = { email, password } as User;
    const response = (await this.userService.getUser(user.email)) as User;
    const payload: Payload = {
      email: response.email,
      role: response.userRole,
    };
    const token = this.authService.signPayload(payload);
    return new ResponseSuccess('User authenticated', {
      email: response.email,
      token,
    });
  }
}
