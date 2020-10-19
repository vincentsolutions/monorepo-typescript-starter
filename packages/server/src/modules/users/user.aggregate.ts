import {BaseAggregateRoot} from "../domain/aggregate/base.aggregate-root";
import {UserFirstNameUpdatedEvent} from "./events/impl/user-first-name-updated.event";
import {ICreateUser} from "./commands/impl/create-user.command";
import {UserCreatedEvent} from "./events/impl/user-created.event";
import {UserPhoneNumberUpdatedEvent} from "./events/impl/user-phone-number-updated.event";
import {UserEmailUpdatedEvent} from "./events/impl/user-email-updated.event";
import {UserLastNameUpdatedEvent} from "./events/impl/user-last-name-updated.event";
import {UserPasswordUpdatedEvent} from "./events/impl/user-password-updated.event";
import {UserDeactivatedEvent} from "./events/impl/user-deactivated.event";
import {UserReactivatedEvent} from "./events/impl/user-reactivated.event";
import {Permission} from "./models/Permission";
import {UserPermissionsRemovedEvent} from "./events/impl/user-permissions-removed.event";
import {UserPermissionsAddedEvent} from "./events/impl/user-permissions-added.event";
import {DomainValidationException} from "../core/exceptions/impl/domain-validation.exception";
import {BaseDomainEvent} from "../domain/events/impl/base-domain.event";
import autobind from "autobind-decorator";

export class UserAggregateRoot extends BaseAggregateRoot {
    protected handlers: Map<string, (event: BaseDomainEvent) => void> = new Map<string, (event: BaseDomainEvent) => void>([
        [ UserCreatedEvent.name, this.onUserCreatedEvent ],
        [ UserEmailUpdatedEvent.name, this.onUserEmailUpdatedEvent ],
        [ UserDeactivatedEvent.name, this.onUserDeactivatedEvent ],
        [ UserReactivatedEvent.name, this.onUserReactivatedEvent ],
        [ UserPermissionsAddedEvent.name, this.onUserPermissionsAddedEvent ],
        [ UserPermissionsRemovedEvent.name, this.onUserPermissionsRemovedEvent ],
    ]);

    private email: string;
    private isActive: boolean = true;

    private permissions: Permission[] = [];

    constructor(
        id: string,
        params: Record<string, any> = {}
    ) {
        super(id, params);
    }

    updateFirstName(newFirstName: string) {
        this.apply(new UserFirstNameUpdatedEvent(this.id, newFirstName));
    }

    updateLastName(newLastName: string) {
        this.apply(new UserLastNameUpdatedEvent(this.id, newLastName));
    }

    updateEmail(newEmail: string) {
        this.apply(new UserEmailUpdatedEvent(this.id, newEmail));
    }

    @autobind
    onUserEmailUpdatedEvent(event: UserEmailUpdatedEvent) {
        this.email = event.email;
    }

    updatePhoneNumber(newPhoneNumber?: string) {
        this.apply(new UserPhoneNumberUpdatedEvent(this.id, newPhoneNumber));
    }

    reactivate() {
        if (this.isActive) {
            throw new DomainValidationException('User is already active', UserAggregateRoot);
        }

        this.apply(new UserReactivatedEvent(this.id));
    }

    @autobind
    onUserReactivatedEvent(event: UserReactivatedEvent) {
        this.isActive = true;
    }

    deactivate() {
        if (!this.isActive) {
            throw new DomainValidationException('User is already inactive', UserAggregateRoot);
        }

        this.apply(new UserDeactivatedEvent(this.id));
    }

    @autobind
    onUserDeactivatedEvent(event: UserDeactivatedEvent) {
        this.isActive = false;
    }

    updatePassword(newPassword: string) {
        this.apply(new UserPasswordUpdatedEvent(this.id, newPassword));
    }

    addPermissions(permissionsToAdd: Permission[]) {
        if (permissionsToAdd.length === 0 || permissionsToAdd.every(x => this.permissions.includes(x))) {
            return;
        }

        this.apply(new UserPermissionsAddedEvent(this.id, permissionsToAdd));
    }

    @autobind
    onUserPermissionsAddedEvent(event: UserPermissionsAddedEvent) {
        for (const permission of event.permissionsToAdd) {
            if (this.permissions.includes(permission)) {
                continue;
            }

            this.permissions.push(permission);
        }
    }

    removePermissions(permissionsToRemove: Permission[]) {
        if (permissionsToRemove.length === 0) {
            return;
        }

        if (permissionsToRemove.some(x => !this.permissions.includes(x))) {
            throw new DomainValidationException("Permissions to be removed are not all present on User", UserAggregateRoot);
        }

        this.apply(new UserPermissionsRemovedEvent(this.id, permissionsToRemove));
    }

    @autobind
    onUserPermissionsRemovedEvent(event: UserPermissionsRemovedEvent) {
        for (const permission of event.permissionsToRemove) {
            const index = this.permissions.indexOf(permission);

            if (index >= 0) {
                this.permissions.splice(index, 1);
            }
        }
    }

    markAsCreated(params: ICreateUser) {
        this.apply(new UserCreatedEvent(this.id, params));
    }

    @autobind
    onUserCreatedEvent(event: UserCreatedEvent) {
        this.buildFromRecord(event.params);
    }

    get asJson() {
        return {
            ...super.asJson,
            email: this.email,
            isActive: this.isActive,
            permissions: this.permissions
        }
    }
}