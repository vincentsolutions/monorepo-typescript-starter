import {CommandHandler} from "@nestjs/cqrs";
import {UpdateUserPasswordCommand} from "../impl/update-user-password.command";
import {Connection} from "typeorm/index";
import {BaseCommandHandler} from "../../../domain/commands/handlers/base.command-handler";
import {User} from "../../user.entity";
import {UserAggregateRoot} from "../../user.aggregate";
import {CryptoService} from "@server/core";

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordCommandHandler extends BaseCommandHandler<UpdateUserPasswordCommand, User, UserAggregateRoot> {

    constructor(
        connection: Connection,
        private readonly cryptoService: CryptoService
    ) {
        super(User, UserAggregateRoot, connection);
    }

    protected async executeInternal(command: UpdateUserPasswordCommand, aggregateRoot: UserAggregateRoot) {
        const { newPassword } = command;

        const hashedNewPassword = await this.cryptoService.hashPassword(newPassword);

        aggregateRoot.updatePassword(hashedNewPassword);
    }
}