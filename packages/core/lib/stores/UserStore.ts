import {BaseCollectionStore, container, IUsersApi, lazyInject, SocketClient, User} from "../internal";
import {injectable} from "inversify";
import {action, computed, makeObservable} from "mobx";
import {Symbols} from "../ioc/symbols";
import {
    UserCreatedEvent,
    UserDeactivatedEvent,
    UserEmailUpdatedEvent,
    UserFirstNameUpdatedEvent,
    UserLastNameUpdatedEvent,
    UserPermissionsAddedEvent,
    UserPermissionsRemovedEvent,
    UserPhoneNumberUpdatedEvent,
    UserReactivatedEvent
} from "@monorepo/server";

@injectable()
export class UserStore extends BaseCollectionStore<User> {
    @lazyInject(SocketClient) private readonly _socketClient: SocketClient;
    @lazyInject(Symbols.apis.users) private readonly _usersApi: IUsersApi;

    constructor() {
        super();

        makeObservable(this);

        this.subscribeToEvents();
    }

    @computed public get ownUser(): User | undefined {
        if (!this._authStore.identity) {
            return undefined;
        }

        return this._items.find(x => x.id === this._authStore.identity!.sub);
    }
    
    public updateUserFirstName = async (id: string, firstName: string) => {
        this.loadingStates.set(this.updateUserFirstName.name, true);

        await this._usersApi.updateUserFirstName(id, firstName);
        
        this.loadingStates.set(this.updateUserFirstName.name, false);
    }

    public updateUserLastName = async (id: string, lastName: string) => {
        this.loadingStates.set(this.updateUserLastName.name, true);

        await this._usersApi.updateUserLastName(id, lastName);

        this.loadingStates.set(this.updateUserLastName.name, false);
    }

    protected async _loadItems(): Promise<User[]> {
        const dtos = await this._usersApi.getUsers();

        console.log(dtos);

        return dtos.map(dto => User.createFromDto(dto));
    }

    protected subscribeToEvents(): void {
        this._socketClient.subscribeToEvents({
            [UserCreatedEvent.name]: this.onUserCreatedEvent,
            [UserDeactivatedEvent.name]: this.onUserDeactivatedEvent,
            [UserReactivatedEvent.name]: this.onUserReactivatedEvent,
            [UserFirstNameUpdatedEvent.name]: this.onUserFirstNameUpdatedEvent,
            [UserLastNameUpdatedEvent.name]: this.onUserLastNameUpdatedEvent,
            [UserEmailUpdatedEvent.name]: this.onUserEmailUpdatedEvent,
            [UserPhoneNumberUpdatedEvent.name]: this.onUserPhoneNumberUpdatedEvent,
            [UserPermissionsAddedEvent.name]: this.onUserPermissionsAddedEvent,
            [UserPermissionsRemovedEvent.name]: this.onUserPermissionsRemovedEvent
        });
    }

    @action.bound private onUserCreatedEvent(event: UserCreatedEvent) {

    }

    @action.bound private onUserDeactivatedEvent(event: UserDeactivatedEvent) {
        const userIndex = this.findItemIndexById(event.aggregateRootId);

        if (userIndex === -1) {
            console.log(`Could not find user with id '${event.aggregateRootId}' in store`);
        }

        this._items.splice(userIndex, 1);
    }
    
    @action.bound private onUserReactivatedEvent(event: UserReactivatedEvent) {
        const userIndex = this.findItemIndexById(event.aggregateRootId);

        if (userIndex === -1) {
            console.log(`Could not find user with id '${event.aggregateRootId}' in store`);
        }

        this.loadItems();
    }
    
    @action.bound private onUserFirstNameUpdatedEvent(event: UserFirstNameUpdatedEvent) {
        const userIndex = this.findItemIndexById(event.aggregateRootId);

        if (userIndex === -1) {
            console.log(`Could not find user with id '${event.aggregateRootId}' in store`);
        }

        this._items[userIndex].firstName = event.params.firstName;
    }

    @action.bound private onUserLastNameUpdatedEvent(event: UserLastNameUpdatedEvent) {
        const userIndex = this.findItemIndexById(event.aggregateRootId);

        if (userIndex === -1) {
            console.log(`Could not find user with id '${event.aggregateRootId}' in store`);
        }

        this._items[userIndex].lastName = event.params.lastName;
    }

    @action.bound private onUserEmailUpdatedEvent(event: UserEmailUpdatedEvent) {
        const userIndex = this.findItemIndexById(event.aggregateRootId);

        if (userIndex === -1) {
            console.log(`Could not find user with id '${event.aggregateRootId}' in store`);
        }

        this._items[userIndex].email = event.params.email;
    }

    @action.bound private onUserPhoneNumberUpdatedEvent(event: UserPhoneNumberUpdatedEvent) {
        const userIndex = this.findItemIndexById(event.aggregateRootId);

        if (userIndex === -1) {
            console.log(`Could not find user with id '${event.aggregateRootId}' in store`);
        }

        this._items[userIndex].phoneNumber = event.params.phoneNumber;
    }

    @action.bound private onUserPermissionsAddedEvent(event: UserPermissionsAddedEvent) {
        const userIndex = this.findItemIndexById(event.aggregateRootId);

        if (userIndex === -1) {
            console.log(`Could not find user with id '${event.aggregateRootId}' in store`);
        }

        this._items[userIndex].permissions.push(...event.params.permissionsToAdd);
    }

    @action.bound private onUserPermissionsRemovedEvent(event: UserPermissionsRemovedEvent) {
        const userIndex = this.findItemIndexById(event.aggregateRootId);

        if (userIndex === -1) {
            console.log(`Could not find user with id '${event.aggregateRootId}' in store`);
        }

        this._items[userIndex].permissions = this._items[userIndex].permissions.filter(x => !event.params.permissionsToRemove.includes(x));
    }
}

container.bind(UserStore).toSelf().inSingletonScope();