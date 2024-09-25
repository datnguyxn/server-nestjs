import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { Payload } from '../../interfaces/payload.interface';
import { sign } from 'jsonwebtoken';
import { default as config } from '../../config/config';

const TAG = 'AuthService';
console.log(TAG);

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signPayload(payload: Payload) {
    return sign(payload, config.jwt.secretOrKey, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }
}
