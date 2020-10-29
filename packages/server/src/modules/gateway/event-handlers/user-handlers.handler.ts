import {UserCreatedEvent} from "../../users/events/impl/user-created.event";
import {EventsHandler} from "@nestjs/cqrs";
import {BaseGatewayEventHandler} from "../../domain/events/handlers/base-gateway.event-handler";
import {BaseUserEvent} from "../../users/user.base-event";
import {UserEmailUpdatedEvent} from "../../users/events/impl/user-email-updated.event";
import {UserLastNameUpdatedEvent} from "../../users/events/impl/user-last-name-updated.event";
import {UserPhoneNumberUpdatedEvent} from "../../users/events/impl/user-phone-number-updated.event";
import {UserPermissionsRemovedEvent} from "../../users/events/impl/user-permissions-removed.event";
import {UserReactivatedEvent} from "../../users/events/impl/user-reactivated.event";
import {UserFirstNameUpdatedEvent} from "../../users/events/impl/user-first-name-updated.event";
import {UserDeactivatedEvent} from "../../users/events/impl/user-deactivated.event";
import {UserPermissionsAddedEvent} from "../../users/events/impl/user-permissions-added.event";

export abstract class BaseUserGatewayEventHandler<TEvent extends BaseUserEvent> extends BaseGatewayEventHandler<TEvent> {
    protected async getAudience(event: UserCreatedEvent): Promise<string[]> {
        return Promise.resolve([ event.aggregateRootId ]);
    }
}

@EventsHandler(UserCreatedEvent)
export class UserCreatedGatewayEventHandler extends BaseUserGatewayEventHandler<UserCreatedEvent>{}

@EventsHandler(UserDeactivatedEvent)
export class UserDeactivatedGatewayEventHandler extends BaseUserGatewayEventHandler<UserDeactivatedEvent>{}

@EventsHandler(UserReactivatedEvent)
export class UserReactivatedGatewayEventHandler extends BaseUserGatewayEventHandler<UserReactivatedEvent>{}

@EventsHandler(UserEmailUpdatedEvent)
export class UserEmailUpdatedGatewayEventHandler extends BaseUserGatewayEventHandler<UserEmailUpdatedEvent>{}

@EventsHandler(UserFirstNameUpdatedEvent)
export class UserFirstNameUpdatedGatewayEventHandler extends BaseUserGatewayEventHandler<UserFirstNameUpdatedEvent>{}

@EventsHandler(UserLastNameUpdatedEvent)
export class UserLastNameUpdatedGatewayEventHandler extends BaseUserGatewayEventHandler<UserLastNameUpdatedEvent>{}

@EventsHandler(UserPhoneNumberUpdatedEvent)
export class UserPhoneNumberUpdatedGatewayEventHandler extends BaseUserGatewayEventHandler<UserPhoneNumberUpdatedEvent>{}

@EventsHandler(UserPermissionsAddedEvent)
export class UserPermissionsAddedGatewayEventHandler extends BaseUserGatewayEventHandler<UserPermissionsAddedEvent>{}

@EventsHandler(UserPermissionsRemovedEvent)
export class UserPermissionsRemovedGatewayEventHandler extends BaseUserGatewayEventHandler<UserPermissionsRemovedEvent>{}