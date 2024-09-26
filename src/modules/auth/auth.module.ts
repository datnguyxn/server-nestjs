import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { EmailScalar } from '../../scalars/email.scalar';
import { DateScalar } from '../../scalars/date.scalar';
import { AuthController } from './auth.controller';

const TAG = 'AuthModule';
console.log(TAG);

@Module({
  imports: [UserModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [AuthResolver, AuthService, JwtStrategy, EmailScalar, DateScalar],
})
export class AuthModule {}
