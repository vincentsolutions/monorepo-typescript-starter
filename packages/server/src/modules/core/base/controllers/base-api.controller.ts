import {BaseController} from "./base.controller";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {Inject} from "@nestjs/common";
import {BaseCommand} from "../commands/impl/base.command";
import {BaseQuery} from "../queries/base.query";

export class BaseApiController extends BaseController {
    @Inject() protected readonly commandBus: CommandBus;
    @Inject() protected readonly queryBus: QueryBus;

    protected async sendCommands<TCommand extends BaseCommand = BaseCommand>(...commands: TCommand[]) {
        const commandExecutions: Promise<any>[] = [];

        for (const command of commands) {
            commandExecutions.push(this.commandBus.execute(command));
        }

        await Promise.all(commandExecutions);
    }

    protected async executeQuery<TResult, TQuery extends BaseQuery = BaseQuery>(query: TQuery) {
        return await this.queryBus.execute<TQuery, TResult>(query);
    }
}