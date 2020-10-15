import {BaseEventHandler} from "../../../core/base/events/handlers/base.event-handler";
import {UserEmailUpdatedEvent} from "../impl/user-email-updated.event";
import {Repository} from "typeorm/index";
import {User} from "../../user.entity";
import {EventsHandler} from "@nestjs/cqrs";
import {InjectRepository} from "@nestjs/typeorm";

@EventsHandler(UserEmailUpdatedEvent)
export class UserEmailUpdatedEventHandler extends BaseEventHandler<UserEmailUpdatedEvent> {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super();
    }

    async handleInternal(event: UserEmailUpdatedEvent) {
        const { aggregateRootId, email } = event;

        const user = await this.userRepository.findOne(aggregateRootId);
        user.email = email;

        await this.userRepository.save(user);
    }
}