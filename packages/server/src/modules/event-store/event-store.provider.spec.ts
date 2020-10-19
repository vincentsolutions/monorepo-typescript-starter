import { Test, TestingModule } from '@nestjs/testing';
import { EventStore } from './event-store.provider';

describe('EventStore', () => {
  let provider: EventStore;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventStore],
    }).compile();

    provider = module.get<EventStore>(EventStore);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
