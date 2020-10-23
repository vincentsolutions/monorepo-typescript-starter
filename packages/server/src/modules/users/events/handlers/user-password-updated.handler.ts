import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserPasswordUpdatedEvent} from "../impl/user-password-updated.event";
import {Repository} from "typeorm/index";
import {User} from "../../user.entity";
import {EventsHandler} from "@nestjs/cqrs";
import {InjectRepository} from "@nestjs/typeorm";

@EventsHandler(UserPasswordUpdatedEvent)
export class UserPasswordUpdatedEventHandler extends BaseEventHandler<UserPasswordUpdatedEvent> {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super();
    }

    async handleInternal(event: UserPasswordUpdatedEvent) {
        const { aggregateRootId, params: { newPassword } } = event;

        const user = await this.userRepository.findOne(aggregateRootId);
        user.password = newPassword;

        await this.userRepository.save(user);
    }
}