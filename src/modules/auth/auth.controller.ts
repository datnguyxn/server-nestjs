import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { ResetPasswordDto } from '../../dto/reset-password.dto';
import { IResponse } from '../../interfaces/response.interface';
import { ResponseError, ResponseSuccess } from '../../dto/response.dto';

const TAG = 'AuthController';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPassword: ResetPasswordDto,
  ): Promise<IResponse> {
    try {
      var isPasswordChanged: boolean = false;
      const user = await this.userService.getUser(resetPassword.email);
      if (!user) {
        return new ResponseError('User not found', HttpStatus.NOT_FOUND);
      } else {
        const isValidPassword = await this.userService.checkPassword(
          resetPassword.email,
          resetPassword.currentPassword,
        );
        if (!isValidPassword) {
          return new ResponseError('Invalid password', HttpStatus.BAD_REQUEST);
        } else {
          isPasswordChanged = await this.userService.setPassword(
            resetPassword.email,
            resetPassword.newPassword,
          );
          if (isPasswordChanged) {
            return new ResponseSuccess(
              'Password changed successfully',
              HttpStatus.OK,
            );
          } else {
            return new ResponseError(
              'Error resetting password',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        }
      }
    } catch (e) {
      console.log(TAG, 'resetPassword', e);
      throw new HttpException(
        'Error resetting password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
