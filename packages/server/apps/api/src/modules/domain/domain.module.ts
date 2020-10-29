import {DynamicModule, Module} from '@nestjs/common';
import {DomainService} from "./services/domain.service";
import {CqrsModule} from "@nestjs/cqrs";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AggregateSnapshot} from "./entities/aggregate-snapshot.entity";
import {AggregateSnapshotService} from "./services/aggregate-snapshot.service";
import {EventStoreModule} from "../event-store/event-store.module";
import {EventStoreService} from "../event-store/event-store.service";
import {AggregateSnapshotRepository} from "./repositories/aggregate-snapshot.repository";

@Module({
    imports: [
        CqrsModule,
        EventStoreModule.forFeature(),
        TypeOrmModule.forFeature([ AggregateSnapshot, AggregateSnapshotRepository ])
    ],
    providers: [
        DomainService,
        EventStoreService,
        AggregateSnapshotService
    ],
    exports: [
        DomainService
    ]
})
export class DomainModule {
    static forFeature(): DynamicModule {
        return {
            module: DomainModule,
            providers: [
                DomainService
            ],
            exports: [
                DomainService
            ]
        }
    }
}
