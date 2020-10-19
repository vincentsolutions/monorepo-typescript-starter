import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserDeactivatedEvent} from "../impl/user-deactivated.event";
import {Repository} from "typeorm/index";
import {User} from "../../user.entity";
import {EventsHandler} from "@nestjs/cqrs";
import {InjectRepository} from "@nestjs/typeorm";

@EventsHandler(UserDeactivatedEvent)
export class UserDeactivatedEventHandler extends BaseEventHandler<UserDeactivatedEvent> {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super();
    }

    async handleInternal(event: UserDeactivatedEvent) {
        const { aggregateRootId } = event;

        const user = await this.userRepository.findOne(aggregateRootId);

        user.isActive = false;
        await this.userRepository.save(user);
    }
}