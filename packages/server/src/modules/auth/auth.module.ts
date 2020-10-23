import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategies/local/local.strategy";
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./constants";
import {JwtStrategy} from "./strategies/jwt/jwt.strategy";
import {CqrsModule} from "@nestjs/cqrs";

@Module({
  imports: [
      UsersModule,
      CqrsModule,
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '600s' }
      })
  ],
  controllers: [AuthController],
  providers: [
      AuthService,
      LocalStrategy,
      JwtStrategy
  ]
})
export class AuthModule {}
