import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from './auth.service';
import {UsersService} from "../users/users.service";
import {CryptoService} from "../core/services/crypto.service";
import {JwtService} from "@nestjs/jwt";
import {CqrsModule} from "@nestjs/cqrs";
import {Permission} from "../users/models/Permission";
import {v4} from "uuid";
import {User} from "../users/user.entity";
import {UserMock_JohnDoe} from "../../../test/mocks/user.mocks";
import {JwtPayload} from "./strategies/jwt/jwt.payload";

describe('AuthService', () => {
    let sut: AuthService;

    const mockUser = new UserMock_JohnDoe();

    let usersServiceMock = {
        create: (firstName: string, lastName: string, email: string, password: string, phoneNumber: string, permissions: Permission[]) => new Promise(resolve => resolve(mockUser.id)),
        findByEmail: (email: string) => new Promise(resolve => resolve(email === mockUser.email ? mockUser : undefined)),
        findById: (id: string) => new Promise(resolve => resolve(id === mockUser.id ? mockUser : undefined)),
    };

    let jwtServiceMock = {
        sign: (payload: JwtPayload) => "ey...",
    };

    let cryptoServiceMock = {
        comparePassword: (password: string, hashedPassword: string) => password === hashedPassword
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                AuthService,
                {
                    provide: CryptoService,
                    useValue: cryptoServiceMock
                },
                {
                    provide: UsersService,
                    useValue: usersServiceMock
                },
                {
                    provide: JwtService,
                    useValue: jwtServiceMock
                }
            ]
        }).compile();

        sut = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(sut).toBeDefined();
    });

    describe("validateUser(string, string)", () => {
        it("should return a user given valid credentials", async () => {
            const result = await sut.validateUser(mockUser.email, mockUser.password);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockUser.id);
        });

        it("should return null given invalid credentials", async () => {
            const result = await sut.validateUser(mockUser.email, "wrongpassword");

            expect(result).toBeNull();
        })
    });

    describe("signIn(User)", () => {
        it("should return an accessToken given a valid user", async () => {
            const result = await sut.signIn(mockUser);

            expect(result).toBeDefined();
            expect(result.accessToken).toBeTruthy();
        });

        it("should throw given a null user", async () => {
            await expect(sut.signIn(null)).rejects.toThrow();
        });
    });

    describe("signUp(SignUpDto)", () => {
        it("should return an accessToken given a valid dto", async () => {
            const result = await sut.signUp({
                firstName: mockUser.firstName,
                lastName: mockUser.lastName,
                email: mockUser.email,
                password: mockUser.password
            });

            expect(result).toBeDefined();
            expect(result.accessToken).toBeTruthy();
        });

        it("should throw given an empty dto", async () => {
            await expect(sut.signUp(undefined)).rejects.toThrow();
        })
    });
});
