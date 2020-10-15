import {Injectable} from "@nestjs/common";
import {BaseService} from "../core/base/services/base.service";
import {User} from "./user.entity";
import {CreateUserCommand} from "./commands/impl/create-user.command";
import {v4} from "uuid";
import {GetUsersQuery} from "./queries/impl/get-users.query";
import {Permission} from "./models/Permission";
import {GetUserByQuery} from "./queries/impl/get-user-by";
import {DeactivateUserCommand} from "./commands/impl/deactivate-user.command";
import {ReactivateUserCommand} from "./commands/impl/reactivate-user.command";
import {AddUserPermissionsCommand} from "./commands/impl/add-user-permissions.command";
import {RemoveUserPermissionsCommand} from "./commands/impl/remove-user-permissions.command";

@Injectable()
export class UsersService extends BaseService<User> {
    constructor(
    ) {
        super();
    }

    async findAll() {
        return await this.executeQuery<User[]>(new GetUsersQuery());
    }

    async findById(id: string) {
        return await this.executeQuery<User | undefined>(new GetUserByQuery(id))
    }

    async findByEmail(email: string) {
        return await this.executeQuery<User | undefined>(new GetUserByQuery({ email }));
    }

    async create(firstName: string, lastName: string, email: string, password: string, phoneNumber?: string, permissions: Permission[] = []) {
        const id = v4();

        await this.commandBus.execute(new CreateUserCommand(id, firstName, lastName, email, password, phoneNumber, permissions));

        return id;
    }

    async deactivate(id: string) {
        await this.commandBus.execute(new DeactivateUserCommand(id));
    }

    async reactivate(id: string) {
        await this.commandBus.execute(new ReactivateUserCommand(id));
    }

    async addPermissions(id: string, permissions: Permission[]) {
        await this.commandBus.execute(new AddUserPermissionsCommand(id, permissions));
    }

    async removePermissions(id: string, permissions: Permission[]) {
        await this.commandBus.execute(new RemoveUserPermissionsCommand(id, permissions));
    }
}