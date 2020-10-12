import {BaseStore, container} from "../internal";
import {injectable} from "inversify";
import {computed, makeObservable} from "mobx";

@injectable()
export class AuthStore extends BaseStore {

    constructor() {
        super();

        makeObservable(this);
    }

    @computed get isAuthenticated(): boolean {
        // TODO: Implement auth system
        return true;
    }
}

container.bind(AuthStore).toSelf().inSingletonScope();