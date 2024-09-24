import { Field, InputType } from 'type-graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserRolesShared } from '../shared/user-roles.shared';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  password?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  userRole?: UserRolesShared;
}