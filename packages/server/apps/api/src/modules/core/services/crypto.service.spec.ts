import {CryptoService} from "./crypto.service";
import {Test, TestingModule} from "@nestjs/testing";

describe('CryptoService', () => {
    let service: CryptoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CryptoService]
        }).compile();

        service = module.get<CryptoService>(CryptoService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const password = "MonoRepo$1234";

    describe("hashPassword(string)", () => {
        it('should hash a password', async () => {
            const hash = await service.hashPassword(password);
            expect(hash).toBeTruthy();
        });
    });

    describe("comparePassword(string, string)", () => {
        it('should return true when comparing a password with his corresponding hash', async () => {
            const hash = await service.hashPassword(password);

            const compareResult = await service.comparePassword(password, hash);
            expect(compareResult).toBeTruthy();
        });

        it('should return false when comparing a password with a different hash', async () => {
            const hash = await service.hashPassword(password);

            const compareResult = await service.comparePassword("1234", hash);
            expect(compareResult).toBeFalsy();
        })
    });
})