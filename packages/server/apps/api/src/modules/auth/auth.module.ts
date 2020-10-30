import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategies/local/local.strategy";
import {JwtModule} from "@nestjs/jwt";
import {authConstants} from "./auth.constants";
import {JwtStrategy} from "./strategies/jwt/jwt.strategy";
import {CqrsModule} from "@nestjs/cqrs";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RefreshToken} from "./entities/refresh-token.entity";
import {TokenService} from "./services/token.service";
import {RefreshTokenStrategy} from "./strategies/refresh-token/refresh-token.strategy";
import {RefreshTokenRepository} from "./repositories/refresh-token.repository";

@Module({
  imports: [
      UsersModule,
      CqrsModule,
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.register({
          secret: authConstants.accessToken.secret,
          signOptions: { expiresIn: `${authConstants.accessToken.durationInSec}s` }
      }),
      TypeOrmModule.forFeature([ RefreshToken, RefreshTokenRepository ])
  ],
  controllers: [AuthController],
  providers: [
      AuthService,
      TokenService,
      LocalStrategy,
      RefreshTokenStrategy,
      JwtStrategy
  ]
})
export class AuthModule {}
