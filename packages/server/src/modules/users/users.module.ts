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
        TypeOrmModule.forFeature([User]),
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

    onModuleInit(): any {
        this.eventStoreService.setEventHandlers({});
        this.eventStoreService.bridgeEventsTo((this.eventBus as any).subject$, UserAggregateRoot.constructor.name);
        // @ts-ignore
        // this.eventBus.publisher = this.eventStoreService;
        this.eventBus.register(EventHandlers);
        this.commandBus.register(CommandHandlers);
    }
}
