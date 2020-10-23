import {BaseCollectionStore, container, IUsersApi, lazyInject, User} from "../internal";
import {injectable} from "inversify";
import {makeObservable} from "mobx";

@injectable()
export class UserStore extends BaseCollectionStore<User> {
    @lazyInject(Symbol.for('IUsersApi')) private _usersApi: IUsersApi;

    constructor() {
        super();

        makeObservable(this);
    }

    protected async _loadItems(): Promise<User[]> {
        const dtos = await this._usersApi.getUsers();

        console.log(dtos);

        return dtos.map(dto => User.createFromDto(dto));
    }
}

container.bind(UserStore).toSelf().inSingletonScope();