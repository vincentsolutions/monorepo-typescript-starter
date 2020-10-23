import {Module, OnModuleInit} from '@nestjs/common';
import {CoreModule} from './modules/core/core.module';
import {UsersModule} from './modules/users/users.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Connection, Repository} from "typeorm/index";
import * as ormConfig from './ormconfig';
import {AuthModule} from "./modules/auth/auth.module";
import {User} from "./modules/users/user.entity";
import {CommandBus, CqrsModule} from "@nestjs/cqrs";
import {CreateUserCommand} from "./modules/users/commands/impl/create-user.command";
import {Permission} from "./modules/users/models/Permission";
import { DomainModule } from './modules/domain/domain.module';
import { EventStoreModule } from './modules/event-store/event-store.module';
import { EventStore } from './modules/event-store/event-store.provider';
import {EventStoreService} from "./modules/event-store/event-store.service";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {LoggingInterceptor} from "./modules/core/interceptors/logging.interceptor";
import { GatewayModule } from './modules/gateway/gateway.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(ormConfig),
        CqrsModule,
        EventStoreModule.forFeature(),
        CoreModule,
        UsersModule,
        AuthModule,
        DomainModule,
        GatewayModule
    ],
    controllers: [],
    providers: [
        EventStore,
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor
        }
    ],
})
export class AppModule implements OnModuleInit {
    private readonly userRepository: Repository<User>;

    private readonly SUPER_ADMIN_ID = '99999999-9999-9999-9999-999999999999';
    private readonly SUPER_ADMIN_EMAIL = 'super_admin@monorepo.xyz.com';
    private readonly SUPER_ADMIN_PASSWORD = 'tD0n6d2AFl8VxnWis8TTddItLOz7qqUXigZmnA6QpOySmfgibvKwkRlxa6SoDby';
    private readonly SUPER_ADMIN_FIRST_NAME = 'Super';
    private readonly SUPER_ADMIN_LAST_NAME = 'Admin';

    constructor(
        private readonly connection: Connection,
        private readonly commandBus: CommandBus,
        private readonly eventStoreService: EventStoreService
    ) {
        this.userRepository = connection.getRepository(User);
    }

    async onModuleInit() {
        await this.ensureSuperAdminExists();
    }

    async ensureSuperAdminExists() {
        const superAdminEntity = await this.userRepository.findOne(this.SUPER_ADMIN_ID);

        if (!superAdminEntity) {
            await this.createSuperAdmin();
        }
    }

    async createSuperAdmin() {
        await this.commandBus.execute(new CreateUserCommand(
            this.SUPER_ADMIN_ID,
            this.SUPER_ADMIN_FIRST_NAME,
            this.SUPER_ADMIN_LAST_NAME,
            this.SUPER_ADMIN_EMAIL,
            this.SUPER_ADMIN_PASSWORD,
            undefined,
            [ Permission.Default, Permission.Admin, Permission.SuperAdmin ]
        ));
    }
}
