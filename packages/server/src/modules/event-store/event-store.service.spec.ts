import { Test, TestingModule } from '@nestjs/testing';
import { EventStoreService } from './event-store.service';
import {EventStore} from "./event-store.provider";
import {Logger} from "@nestjs/common";
import {Config} from "../core/config/config";
import {CqrsModule} from "@nestjs/cqrs";

describe('EventStoreService', () => {
  let service: EventStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [EventStoreService, EventStore, Logger, Config],
    }).compile();

    service = module.get<EventStoreService>(EventStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
