import {BaseAggregateRoot} from "../../core/base/domain/base.aggregate-root";
import {UserFirstNameUpdatedEvent} from "../events/impl/user-first-name-updated.event";
import {ICreateUser} from "../commands/impl/create-user.command";
import {UserCreatedEvent} from "../events/impl/user-created.event";
import {UserPhoneNumberUpdatedEvent} from "../events/impl/user-phone-number-updated.event";
import {UserEmailUpdatedEvent} from "../events/impl/user-email-updated.event";
import {UserLastNameUpdatedEvent} from "../events/impl/user-last-name-updated.event";
import {UserPasswordUpdatedEvent} from "../events/impl/user-password-updated.event";
import {UserDeactivatedEvent} from "../events/impl/user-deactivated.event";
import {UserReactivatedEvent} from "../events/impl/user-reactivated.event";
import {Permission} from "../models/Permission";
import {UserPermissionsRemovedEvent} from "../events/impl/user-permissions-removed.event";
import {UserPermissionsAddedEvent} from "../events/impl/user-permissions-added.event";

export class UserAggregateRoot extends BaseAggregateRoot {
    private email: string;
    private isActive: boolean = true;
    private permissions: Permission[] = [];

    constructor(
        private readonly id: string,
        params: Record<string, any>
    ) {
        super(params);
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

    onUserEmailUpdatedEvent(event: UserEmailUpdatedEvent) {
        this.email = event.email;
    }

    updatePhoneNumber(newPhoneNumber?: string) {
        this.apply(new UserPhoneNumberUpdatedEvent(this.id, newPhoneNumber));
    }

    reactivate() {
        this.apply(new UserReactivatedEvent(this.id));
    }

    onUserReactivatedEvent(event: UserReactivatedEvent) {
        this.isActive = true;
    }

    deactivate() {
        this.apply(new UserDeactivatedEvent(this.id));
    }

    onUserDeactivatedEvent(event: UserDeactivatedEvent) {
        this.isActive = false;
    }

    updatePassword(newPassword: string) {
        this.apply(new UserPasswordUpdatedEvent(this.id, newPassword));
    }

    addPermissions(permissionsToAdd: Permission[]) {
        this.apply(new UserPermissionsAddedEvent(this.id, permissionsToAdd));
    }

    onUserPermissionsAddedEvent(event: UserPermissionsAddedEvent) {
        for (const permission of event.permissionsToAdd) {
            if (this.permissions.includes(permission)) {
                continue;
            }

            this.permissions.push(permission);
        }
    }

    removePermissions(permissionsToRemove: Permission[]) {
        this.apply(new UserPermissionsRemovedEvent(this.id, permissionsToRemove));
    }

    onUserPermissionsRemovedEvent(event: UserPermissionsRemovedEvent) {
        for (const permission of event.permissionsToRemove) {
            const index = this.permissions.indexOf(permission);

            if (index >= 0) {
                this.permissions.slice(index, 1);
            }
        }
    }

    markAsCreated(params: ICreateUser) {
        this.apply(new UserCreatedEvent(this.id, params));
    }
}