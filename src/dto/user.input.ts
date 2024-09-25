import { Field, InputType } from 'type-graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

const TAG = 'CreateUserInput';
console.log(TAG);

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  userRole?: string;
}
