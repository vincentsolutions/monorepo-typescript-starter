import {DynamicModule, Global, Module} from '@nestjs/common';
import {EventStoreService} from './event-store.service';
import {EventStore} from "./event-store.provider";
import {CqrsModule} from "@nestjs/cqrs";

@Global()
@Module({
    imports: [
        CqrsModule
    ],
    providers: [
        EventStoreService,
        EventStore,
    ],
    exports: [
        EventStoreService,
        EventStore
    ]
})
export class EventStoreModule {
    static forRoot(): DynamicModule {
        return {
            module: EventStoreModule
        };
    }

    static forFeature(): DynamicModule {
        return {
            module: EventStoreModule,
            providers: [EventStoreService],
            exports: [EventStoreService]
        };
    }
}
