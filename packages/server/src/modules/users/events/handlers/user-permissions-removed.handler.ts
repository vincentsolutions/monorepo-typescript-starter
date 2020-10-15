import {BaseEventHandler} from "../../../core/base/events/handlers/base.event-handler";
import {UserPermissionsRemovedEvent} from "../impl/user-permissions-removed.event";
import {Repository} from "typeorm/index";
import {User} from "../../user.entity";
import {EventsHandler} from "@nestjs/cqrs";
import {InjectRepository} from "@nestjs/typeorm";

@EventsHandler(UserPermissionsRemovedEvent)
export class UserPermissionsRemovedEventHandler extends BaseEventHandler<UserPermissionsRemovedEvent> {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super();
    }

    async handleInternal(event: UserPermissionsRemovedEvent) {
        const { aggregateRootId, permissionsToRemove } = event;

        const user = await this.userRepository.findOne(aggregateRootId);

        user.permissions = user.permissions.filter(x => !permissionsToRemove.includes(x));

        await this.userRepository.save(user);
    }
}