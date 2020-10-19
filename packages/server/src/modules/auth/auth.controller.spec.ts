import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import {AuthService} from "./auth.service";
import {UsersService} from "../users/users.service";
import {CryptoService} from "../core/services/crypto.service";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {CqrsModule} from "@nestjs/cqrs";

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [AuthController],
      providers: [AuthService, UsersService, CryptoService, { provide: JwtService, useValue: new JwtService({}) }]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
