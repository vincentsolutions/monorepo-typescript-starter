import {CommandHandler} from "@nestjs/cqrs";
import {UpdateUserPasswordCommand} from "../impl/update-user-password.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../core/base/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserFactory} from "../../user.factory";
import {UserAggregateRoot} from "../../domain/user.aggregate";
import {CryptoService} from "../../../core/services/crypto.service";

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordCommandHandler extends BaseCommandHandler<UpdateUserPasswordCommand, User, UserAggregateRoot, UserFactory> {

    constructor(
        userFactory: UserFactory,
        connection: Connection,
        private readonly cryptoService: CryptoService
    ) {
        super(User, userFactory, connection);
    }

    protected async executeInternal(command: UpdateUserPasswordCommand) {
        const { aggregateRootId, newPassword } = command;

        const user = await this.getAggregateRootFromEntity(aggregateRootId);

        const hashedNewPassword = await this.cryptoService.hashPassword(newPassword);

        user.updatePassword(hashedNewPassword);
        user.commit();
    }
}