import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserPermissionsAddedEvent} from "../impl/user-permissions-added.event";
import {Repository} from "typeorm/index";
import {User} from "../../user.entity";
import {EventsHandler} from "@nestjs/cqrs";
import {InjectRepository} from "@nestjs/typeorm";

@EventsHandler(UserPermissionsAddedEvent)
export class UserPermissionsAddedEventHandler extends BaseEventHandler<UserPermissionsAddedEvent> {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super();
    }

    async handleInternal(event: UserPermissionsAddedEvent) {
        const { aggregateRootId, permissionsToAdd } = event;

        const user = await this.userRepository.findOne(aggregateRootId);

        for (const permission of permissionsToAdd) {
            if (user.permissions.includes(permission)) {
                continue;
            }

            user.permissions.push(permission)
        }

        await this.userRepository.save(user);
    }
}