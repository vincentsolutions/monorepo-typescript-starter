import {BaseDomainEventHandler} from "../../../core/base/events/handlers/base-domain.event-handler";
import {UserCreatedEvent} from "../impl/user-created.event";
import {User} from "../../user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm/index";
import {EventsHandler} from "@nestjs/cqrs";

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler extends BaseDomainEventHandler<UserCreatedEvent>{
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super();
    }

    async handleInternal(event: UserCreatedEvent) {
        const { aggregateRootId, params } = event;

        const newUser = new User();
        newUser.id = aggregateRootId;
        newUser.firstName = params.firstName;
        newUser.lastName = params.lastName;
        newUser.email = params.email;
        newUser.phoneNumber = params.phoneNumber;
        newUser.password = params.password;
        newUser.permissions = params.permissions;

        await this.userRepository.save(newUser);
    }
}