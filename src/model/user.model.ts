import { Field, ObjectType } from 'type-graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@ObjectType()
export class UserModel {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsOptional()
  userRole?: string;
}
