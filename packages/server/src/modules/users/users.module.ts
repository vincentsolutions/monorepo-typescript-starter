import {Module, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersController} from "./users.controller";
import {CommandBus, CqrsModule, EventBus} from "@nestjs/cqrs";
import {UsersService} from "./users.service";
import {UpdateUserFirstNameCommandHandler} from "./commands/handlers/update-user-first-name.handler";
import {UserFirstNameUpdatedEventHandler} from "./events/handlers/user-first-name-updated.handler";
import {User} from "./user.entity";
import {CreateUserCommandHandler} from "./commands/handlers/create-user.handler";
import {UserCreatedEventHandler} from "./events/handlers/user-created.handler";
import {GetUsersQueryHandler} from "./queries/handlers/get-users.handler";
import {UpdateUserLastNameCommandHandler} from "./commands/handlers/update-user-last-name.handler";
import {UpdateUserEmailCommandHandler} from "./commands/handlers/update-user-email.handler";
import {UpdateUserPhoneNumberCommandHandler} from "./commands/handlers/update-user-phone-number.handler";
import {UpdateUserPasswordCommandHandler} from "./commands/handlers/update-user-password.handler";
import {UserLastNameUpdatedEventHandler} from "./events/handlers/user-last-name-updated.handler";
import {UserEmailUpdatedEventHandler} from "./events/handlers/user-email-updated.handler";
import {UserPhoneNumberUpdatedEventHandler} from "./events/handlers/user-phone-number-updated.handler";
import {UserPasswordUpdatedEventHandler} from "./events/handlers/user-password-updated.handler";
import {GetUserByQueryHandler} from "./queries/handlers/get-user-by.handler";
import {ReactivateUserCommandHandler} from "./commands/handlers/reactivate-user.handler";
import {DeactivateUserCommandHandler} from "./commands/handlers/deactivate-user.handler";
import {UserReactivatedEventHandler} from "./events/handlers/user-reactivated.handler";
import {UserDeactivatedEventHandler} from "./events/handlers/user-deactivated.handler";
import {AddUserPermissionsCommandHandler} from "./commands/handlers/add-user-permissions.handler";
import {RemoveUserPermissionsCommandHandler} from "./commands/handlers/remove-user-permissions.handler";
import {UserPermissionsAddedEventHandler} from "./events/handlers/user-permissions-added.handler";
import {UserPermissionsRemovedEventHandler} from "./events/handlers/user-permissions-removed.handler";
import {ModuleRef} from "@nestjs/core";
import {EventStoreModule} from "../event-store/event-store.module";
import {EventStoreService} from "../event-store/event-store.service";
import {DomainModule} from "../domain/domain.module";
import {UserAggregateRoot} from "./user.aggregate";
import {UserLastNameUpdatedEvent} from "./events/impl/user-last-name-updated.event";
import {UserEmailUpdatedEvent} from "./events/impl/user-email-updated.event";
import {UserCreatedEvent} from "./events/impl/user-created.event";
import {UserPhoneNumberUpdatedEvent} from "./events/impl/user-phone-number-updated.event";
import {UserPasswordUpdatedEvent} from "./events/impl/user-password-updated.event";
import {UserPermissionsRemovedEvent} from "./events/impl/user-permissions-removed.event";
import {UserReactivatedEvent} from "./events/impl/user-reactivated.event";
import {UserFirstNameUpdatedEvent} from "./events/impl/user-first-name-updated.event";
import {UserDeactivatedEvent} from "./events/impl/user-deactivated.event";
import {UserPermissionsAddedEvent} from "./events/impl/user-permissions-added.event";
import {UserRepository} from "./user.repository";

export const CommandHandlers = [
    CreateUserCommandHandler, UpdateUserFirstNameCommandHandler, UpdateUserLastNameCommandHandler,
    UpdateUserEmailCommandHandler, UpdateUserPhoneNumberCommandHandler, UpdateUserPasswordCommandHandler,
    ReactivateUserCommandHandler, DeactivateUserCommandHandler, AddUserPermissionsCommandHandler,
    RemoveUserPermissionsCommandHandler
];
export const EventHandlers = [
    UserCreatedEventHandler, UserFirstNameUpdatedEventHandler, UserLastNameUpdatedEventHandler,
    UserEmailUpdatedEventHandler, UserPhoneNumberUpdatedEventHandler, UserPasswordUpdatedEventHandler,
    UserReactivatedEventHandler, UserDeactivatedEventHandler, UserPermissionsAddedEventHandler,
    UserPermissionsRemovedEventHandler
];
export const QueryHandlers = [ GetUsersQueryHandler, GetUserByQueryHandler ];

@Module({
    imports: [
        CqrsModule,
        EventStoreModule.forFeature(),
        TypeOrmModule.forFeature([User, UserRepository]),
        DomainModule.forFeature()
    ],
    providers: [
        UsersService,
        ...CommandHandlers,
        ...EventHandlers,
        ...QueryHandlers
    ],
    controllers: [UsersController],
    exports: [TypeOrmModule, UsersService]
})
export class UsersModule implements OnModuleInit {
    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly commandBus: CommandBus,
        private readonly eventBus: EventBus,
        private readonly eventStoreService: EventStoreService
    ) {
    }

    async onModuleInit(): Promise<any> {
        this.eventStoreService.setEventFactories([
            [ UserCreatedEvent.name, data => new UserCreatedEvent(data.aggregateRootId, data.params, data.version) ],
            [ UserDeactivatedEvent.name, data => new UserDeactivatedEvent(data.aggregateRootId, undefined, data.version) ],
            [ UserReactivatedEvent.name, data => new UserReactivatedEvent(data.aggregateRootId, undefined, data.version) ],
            [ UserFirstNameUpdatedEvent.name, data => new UserFirstNameUpdatedEvent(data.aggregateRootId, data.params, data.version) ],
            [ UserLastNameUpdatedEvent.name, data => new UserLastNameUpdatedEvent(data.aggregateRootId, data.params, data.version) ],
            [ UserEmailUpdatedEvent.name, data => new UserEmailUpdatedEvent(data.aggregateRootId, data.params, data.version) ],
            [ UserPhoneNumberUpdatedEvent.name, data => new UserPhoneNumberUpdatedEvent(data.aggregateRootId, data.params, data.version) ],
            [ UserPasswordUpdatedEvent.name, data => new UserPasswordUpdatedEvent(data.aggregateRootId, data.params, data.version) ],
            [ UserPermissionsAddedEvent.name, data => new UserPermissionsAddedEvent(data.aggregateRootId, data.params, data.version) ],
            [ UserPermissionsRemovedEvent.name, data => new UserPermissionsRemovedEvent(data.aggregateRootId, data.params, data.version) ]
        ])
        await this.eventStoreService.bridgeEventsTo((this.eventBus as any).subject$, UserAggregateRoot.name);
        // this.eventBus.register(EventHandlers);
        // this.commandBus.register(CommandHandlers);
    }
}
