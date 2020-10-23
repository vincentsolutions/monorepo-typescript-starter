import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserLastNameUpdatedEvent} from "../impl/user-last-name-updated.event";
import {Repository} from "typeorm/index";
import {User} from "../../user.entity";
import {EventsHandler} from "@nestjs/cqrs";
import {InjectRepository} from "@nestjs/typeorm";

@EventsHandler(UserLastNameUpdatedEvent)
export class UserLastNameUpdatedEventHandler extends BaseEventHandler<UserLastNameUpdatedEvent> {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super();
    }

    async handleInternal(event: UserLastNameUpdatedEvent) {
        const { aggregateRootId, params: { lastName } } = event;

        const user = await this.userRepository.findOne(aggregateRootId);
        user.lastName = lastName;

        await this.userRepository.save(user);
    }
}