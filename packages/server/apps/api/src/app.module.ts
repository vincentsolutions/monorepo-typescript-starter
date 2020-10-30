import {MiddlewareConsumer, Module, NestModule, OnModuleInit, RequestMethod} from '@nestjs/common';
import {CoreModule} from './modules/core/core.module';
import {UsersModule} from './modules/users/users.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Connection, Repository} from "typeorm/index";
import * as ormConfig from './ormconfig';
import {AuthModule} from "./modules/auth/auth.module";
import {User} from "./modules/users/user.entity";
import {CommandBus, CqrsModule, EventBus} from "@nestjs/cqrs";
import {CreateUserCommand} from "./modules/users/commands/impl/create-user.command";
import {DomainModule} from './modules/domain/domain.module';
import {EventStoreModule} from './modules/event-store/event-store.module';
import {EventStore} from './modules/event-store/event-store.provider';
import {EventStoreService} from "./modules/event-store/event-store.service";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {LoggingInterceptor} from "./modules/core/interceptors/logging.interceptor";
import {GatewayModule} from './modules/gateway/gateway.module';
import {Permission} from "@sharedKernel";
import {TransactionMiddleware} from "./modules/core/middlewares/transaction.middleware";
import {BullModule} from "@nestjs/bull";
import {coreConstants} from "./modules/core/core.constants";

@Module({
    imports: [
        TypeOrmModule.forRoot(ormConfig),
        BullModule.forRoot({ redis: coreConstants.redisSettings }),
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
export class AppModule implements OnModuleInit, NestModule {
    private readonly userRepository: Repository<User>;

    private readonly SUPER_ADMIN_ID = '99999999-9999-9999-9999-999999999999';
    private readonly SUPER_ADMIN_EMAIL = 'super_admin@monorepo.xyz.com';
    private readonly SUPER_ADMIN_PASSWORD = 'tD0n6d2AFl8VxnWis8TTddItLOz7qqUXigZmnA6QpOySmfgibvKwkRlxa6SoDby';
    private readonly SUPER_ADMIN_FIRST_NAME = 'Super';
    private readonly SUPER_ADMIN_LAST_NAME = 'Admin';

    constructor(
        private readonly connection: Connection,
        private readonly commandBus: CommandBus,
        private readonly eventBus: EventBus,
        private readonly eventStoreService: EventStoreService
    ) {
        this.userRepository = connection.getRepository(User);
    }

    async onModuleInit() {
        await this.ensureSuperAdminExists();

        // @ts-ignore
        this.eventBus.publisher = this.eventStoreService;
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

    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(TransactionMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.POST })
            .apply(TransactionMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.PUT })
            .apply(TransactionMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.PATCH })
            .apply(TransactionMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.DELETE });
    }
}
