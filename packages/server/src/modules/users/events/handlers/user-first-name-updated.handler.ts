import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserFirstNameUpdatedEvent} from "../impl/user-first-name-updated.event";
import {Repository} from "typeorm/index";
import {User} from "../../user.entity";
import {EventsHandler} from "@nestjs/cqrs";
import {InjectRepository} from "@nestjs/typeorm";

@EventsHandler(UserFirstNameUpdatedEvent)
export class UserFirstNameUpdatedEventHandler extends BaseEventHandler<UserFirstNameUpdatedEvent> {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super();
    }

    async handleInternal(event: UserFirstNameUpdatedEvent) {
        const { aggregateRootId, firstName } = event;

        const user = await this.userRepository.findOne(aggregateRootId);
        user.firstName = firstName;

        await this.userRepository.save(user);
    }
}