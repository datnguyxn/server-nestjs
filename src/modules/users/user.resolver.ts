import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserModel } from '../../model/user.model';
import { CurrentUser } from '../../common/decorators/users.decorator';
import { UpdateUserInput } from '../../dto/update-user.input';
import { User } from '../../interfaces/user.interface';
import { UserRolesShared } from '../../shared/user-roles.shared';

@UseGuards(GraphqlAuthGuard)
@UseGuards(RolesGuard)
@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {
  }

  // @Roles('Admin')
  @Query(() => [UserModel])
  async users() {
    return await this.userService.showAll();
  }

  @Query(() => [UserModel])
  async user(@Args('email') email: string) {
    return await this.userService.getUser(email);
  }

  @Mutation(() => UserModel)
  async delete(@Args('id') id: string, @CurrentUser() user: User) {
    if (id === user.id) {
      return await this.userService.delete(id);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => UserModel)
  async update(
    @Args('id') id: string,
    @Args('user') user: UpdateUserInput,
    @CurrentUser() currentUser: User,
  ) {
    if (
      id === currentUser.id ||
      currentUser.userRole === UserRolesShared.ADMIN
    ) {
      return await this.userService.update(id, user, currentUser.userRole);
    } else {
      throw new UnauthorizedException();
    }
  }
}