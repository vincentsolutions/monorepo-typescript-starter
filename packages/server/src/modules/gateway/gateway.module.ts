import {Global, Module} from '@nestjs/common';
import {Gateway} from "./gateway.service";
import {CqrsModule} from "@nestjs/cqrs";
import {
    UserPermissionsRemovedGatewayEventHandler, UserPermissionsAddedGatewayEventHandler, UserDeactivatedGatewayEventHandler,
    UserReactivatedGatewayEventHandler, UserPhoneNumberUpdatedGatewayEventHandler, UserEmailUpdatedGatewayEventHandler,
    UserLastNameUpdatedGatewayEventHandler, UserCreatedGatewayEventHandler, UserFirstNameUpdatedGatewayEventHandler
} from "./event-handlers/user-handlers.handler";

const UserEventHandlers = [
    UserPermissionsRemovedGatewayEventHandler, UserPermissionsAddedGatewayEventHandler, UserDeactivatedGatewayEventHandler,
    UserReactivatedGatewayEventHandler, UserPhoneNumberUpdatedGatewayEventHandler, UserEmailUpdatedGatewayEventHandler,
    UserLastNameUpdatedGatewayEventHandler, UserCreatedGatewayEventHandler, UserFirstNameUpdatedGatewayEventHandler
];

@Global()
@Module({
    imports: [CqrsModule],
    providers: [
        Gateway,
        ...UserEventHandlers
    ],
    exports: [Gateway]
})
export class GatewayModule {}
