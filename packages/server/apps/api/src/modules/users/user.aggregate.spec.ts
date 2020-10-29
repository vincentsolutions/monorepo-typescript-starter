import {UserAggregateRoot} from "./user.aggregate";
import {v4} from "uuid";
import {UserCreatedEvent} from "./events/impl/user-created.event";
import {UserEmailUpdatedEvent} from "./events/impl/user-email-updated.event";
import {checkEventInAggregate} from "../../../test/base/aggregate.test-helpers";
import {UserDeactivatedEvent} from "./events/impl/user-deactivated.event";
import {DomainValidationException} from "../core/exceptions/impl/domain-validation.exception";
import {UserReactivatedEvent} from "./events/impl/user-reactivated.event";
import {UserPermissionsAddedEvent} from "./events/impl/user-permissions-added.event";
import {UserPermissionsRemovedEvent} from "./events/impl/user-permissions-removed.event";
import {Permission} from "@sharedKernel";
import {ICreateUser} from "@sharedKernel";

describe(UserAggregateRoot, () => {

    describe("constructor", () => {
        let id: string;

        beforeEach(() => {
            id = v4();
        })

        it("should initialize with an id", () => {
            const aggregate = new UserAggregateRoot(id);

            expect(aggregate).toBeDefined();
            expect(aggregate).toBeInstanceOf(UserAggregateRoot);
            expect(aggregate.id).toBe(id);
        });

        it("should initialize with an id and params", () => {
            const email = 'user.test@monorepo.xyz.com';
            const aggregate = new UserAggregateRoot(id, { email })

            expect(aggregate.asJson.email).toBe(email);
        });
    });

    describe("EventHandlers", () => {
        let id: string;
        let aggregate: UserAggregateRoot;

        beforeEach(() => {
            id = v4();
            aggregate = new UserAggregateRoot(id);
        });

        describe(UserCreatedEvent, () => {
            const params: ICreateUser = {
                firstName: 'John',
                lastName: 'Doe',
                password: 'MonoRepo$1234',
                email: 'john.doe@monorepo.xyz.com',
                permissions: [Permission.Default]
            }

            beforeEach(() => {
                aggregate.markAsCreated(params);
            })

            it(`should have a ${UserCreatedEvent.name} in its uncommitted changes`, () => {
                checkEventInAggregate(aggregate, UserCreatedEvent);
            });

            it("should reflect changes in its domain state", () => {
                expect(aggregate.asJson.email).toBe(params.email);
                expect(aggregate.asJson.permissions).toBe(params.permissions);
            });
        });

        describe(UserEmailUpdatedEvent, () => {
            const params = {
                email: 'john.doe_new@monorepo.xyz.com'
            };

            beforeEach(() => {
                aggregate.updateEmail(params.email);
            });

            it(`should have a ${UserCreatedEvent.name} in its uncommitted changes`, () => {
                checkEventInAggregate(aggregate, UserEmailUpdatedEvent);
            });

            it("should reflect changes in its domain state", () => {
                expect(aggregate.asJson.email).toBe(params.email);
            })
        });

        describe(UserDeactivatedEvent, () => {
            beforeEach(() => {
                aggregate.deactivate();
            });

            it(`should have a ${UserDeactivatedEvent.name} in its uncommitted changes`, () => {
                checkEventInAggregate(aggregate, UserDeactivatedEvent);
            });

            it("should reflect changes in its domain state", () => {
                expect(aggregate.asJson.isActive).toBe(false);
            });

            it(`should throw a ${DomainValidationException.name} if the user is already inactive`, () => {
                expect(() => {
                    aggregate.deactivate()
                }).toThrow(DomainValidationException);
            })
        });

        describe(UserReactivatedEvent, () => {
            beforeEach(() => {
                aggregate.deactivate();
                aggregate.markChangesAsCommitted();

                aggregate.reactivate();
            });

            it(`should have a ${UserReactivatedEvent.name} in its uncommitted changes`, () => {
                checkEventInAggregate(aggregate, UserReactivatedEvent);
            });

            it("should reflect changes in its domain state", () => {
                expect(aggregate.asJson.isActive).toBe(true);
            });

            it(`should throw a ${DomainValidationException.name} if the user is already active`, () => {
                expect(() => {
                    aggregate.reactivate()
                }).toThrow(DomainValidationException);
            })
        });

        describe(UserPermissionsAddedEvent, () => {
            const params = {
                permissions: [
                    Permission.Default,
                    Permission.Admin
                ]
            };

            beforeEach(() => {

            });

            it(`should have a ${UserPermissionsAddedEvent.name} in its uncommitted changes`, () => {
                aggregate.addPermissions(params.permissions);

                checkEventInAggregate(aggregate, UserPermissionsAddedEvent);
            });

            it("should reflect changes in its domain state", () => {
                aggregate.addPermissions(params.permissions);

                expect(aggregate.asJson.permissions).toStrictEqual(params.permissions);
            });

            it("should not send an event if there are no permissions to add", () => {
                aggregate.addPermissions([]);

                expect(aggregate.getUncommittedChanges().length).toBe(0);
            })

            it("should not send an event if the permissions are the same", () => {
                aggregate.addPermissions(aggregate.asJson.permissions);

                expect(aggregate.getUncommittedChanges().length).toBe(0);
            })
        });

        describe(UserPermissionsRemovedEvent, () => {
            const params = {
                permissions: [
                    Permission.Admin
                ]
            };

            beforeEach(() => {
                aggregate.addPermissions(params.permissions);
                aggregate.markChangesAsCommitted();
            });

            it(`should have a ${UserPermissionsRemovedEvent.name} in its uncommitted changes`, () => {
                aggregate.removePermissions(params.permissions);

                checkEventInAggregate(aggregate, UserPermissionsRemovedEvent);
            });

            it("should reflect changes in its domain state", () => {
                aggregate.removePermissions(params.permissions);

                expect(aggregate.asJson.permissions).toStrictEqual([]);
            });

            it("should not send an event if there are no permissions to remove", () => {
                aggregate.removePermissions([]);

                expect(aggregate.getUncommittedChanges().length).toBe(0);
            })

            it(`should throw a ${DomainValidationException.name} if the requested permissions to denied are not present on the User`, () => {
                expect(() => {
                    aggregate.removePermissions([Permission.SuperAdmin]);
                }).toThrow(DomainValidationException);
            });
        });
    });
});