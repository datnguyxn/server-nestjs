import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { Payload } from '../../interfaces/payload.interface';
import { sign } from 'jsonwebtoken';
import { default as config } from '../../config/config';
import * as nodemailer from 'nodemailer';

const TAG = 'AuthService';
console.log(TAG);

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {
  }

  async signPayload(payload: Payload) {
    return sign(payload, config.jwt.secretOrKey, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }

  async sendEmailVerification(email: string): Promise<boolean> {
    var model = await this.userService.getUser(email);

    if (model) {
      const transporter = nodemailer.createTransport({
        host: config.mail.host,
        port: config.mail.port,
        secure: config.mail.secure, // true for 465, false for other ports
        auth: {
          user: config.mail.user,
          pass: config.mail.pass,
        },
      } as nodemailer.TransportOptions);

      const mailOptions = {
        from: '"Company" <' + config.mail.user + '>',
        to: email, // list of receivers (separated by ,)
        subject: 'Verify Email',
        text: 'Verify Email',
        html:
          'Hi! <br><br> Thanks for your registration<br><br>' +
          '<a href=' +
          config.host.url +
          ':' +
          config.host.port +
          '/auth/email/verify/'+
          '>Click here to activate your account</a>', // html body
      };

      var sent = await new Promise<boolean>(async function(resolve, reject) {
        return transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.log('Message sent: %s', error);
            return reject(false);
          }
          console.log('Message sent: %s', info.messageId);
          resolve(true);
        });
      });

      return sent;
    } else {
      throw new HttpException(
        'REGISTER.USER_NOT_REGISTERED',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
