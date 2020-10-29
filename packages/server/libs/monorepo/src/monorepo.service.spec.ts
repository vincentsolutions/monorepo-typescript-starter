import { Test, TestingModule } from '@nestjs/testing';
import { MonorepoService } from './monorepo.service';

describe('MonorepoService', () => {
  let service: MonorepoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonorepoService],
    }).compile();

    service = module.get<MonorepoService>(MonorepoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
