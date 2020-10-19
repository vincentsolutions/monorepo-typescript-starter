import {BaseEventHandler} from "../../../domain/events/handlers/base.event-handler";
import {UserPhoneNumberUpdatedEvent} from "../impl/user-phone-number-updated.event";
import {Repository} from "typeorm/index";
import {User} from "../../user.entity";
import {EventsHandler} from "@nestjs/cqrs";
import {InjectRepository} from "@nestjs/typeorm";

@EventsHandler(UserPhoneNumberUpdatedEvent)
export class UserPhoneNumberUpdatedEventHandler extends BaseEventHandler<UserPhoneNumberUpdatedEvent> {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super();
    }

    async handleInternal(event: UserPhoneNumberUpdatedEvent) {
        const { aggregateRootId, phoneNumber } = event;

        const user = await this.userRepository.findOne(aggregateRootId);
        user.phoneNumber = phoneNumber;

        await this.userRepository.save(user);
    }
}