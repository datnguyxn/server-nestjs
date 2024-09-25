import { Module } from '@nestjs/common';
import { default as config } from './config/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApolloDriver } from '@nestjs/apollo';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';

const TAG = 'AppModule';
console.log(TAG);
const mongoUri = config.db;

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      logger: console,
      context: ({ req }) => ({ req }),
      playground: true,
    }),
    MongooseModule.forRoot(mongoUri),
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
