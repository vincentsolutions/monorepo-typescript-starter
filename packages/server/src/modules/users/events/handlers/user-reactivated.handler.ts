import {BaseEventHandler} from "../../../core/base/events/handlers/base.event-handler";
import {UserReactivatedEvent} from "../impl/user-reactivated.event";
import {Repository} from "typeorm/index";
import {User} from "../../user.entity";
import {EventsHandler} from "@nestjs/cqrs";
import {InjectRepository} from "@nestjs/typeorm";

@EventsHandler(UserReactivatedEvent)
export class UserReactivatedEventHandler extends BaseEventHandler<UserReactivatedEvent> {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super();
    }

    async handleInternal(event: UserReactivatedEvent) {
        const { aggregateRootId } = event;

        const user = await this.userRepository.findOne(aggregateRootId);

        user.isActive = true;
        await this.userRepository.save(user);
    }
}