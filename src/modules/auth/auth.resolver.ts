import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { User } from '../../interfaces/user.interface';
import { UserRolesShared } from '../../shared/user-roles.shared';
import { AuthModel } from '../../model/auth.model';
import { Payload } from '../../interfaces/payload.interface';

const TAG = 'AuthResolver';
console.log(TAG);

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation(() => AuthModel)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    console.log(TAG, 'email', typeof email);
    const user = {
      email,
      password,
      userRole: UserRolesShared.NORMAL,
    } as User;
    try {
      console.log('user', user);
      const response = (await this.userService.create(user)) as User;
      const payload: Payload = {
        email: response.email,
        role: response.userRole,
      };

      const token = this.authService.signPayload(payload);
      return { email: response.email, token };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  @Mutation(() => AuthModel)
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
    return { email: response.email, token };
  }
}
