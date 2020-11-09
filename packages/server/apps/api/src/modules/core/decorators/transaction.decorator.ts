import {getConnection} from "typeorm/index";
import {getNamespace} from "cls-hooked";
import {coreConstants} from "@server/core";

export const typeOrmEntityManagerKey = "__typeOrm__transactionalEntityManager";

export function Transaction(connectionName: string = "default"): MethodDecorator {
    return function (target: Object, methodName: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const context = getNamespace(coreConstants.transactionContextNamespace);

            if (!context) {
                throw new Error("No CLS namespace defined in your app ... Cannot use CLS transaction management.");
            }

            if (!context.active) {
                throw new Error("No CLS active context detected ... Cannot use CLS transaction management.")
            }

            const transactionalEntityManager = context.get(typeOrmEntityManagerKey);

            if (!transactionalEntityManager) {
                return await getConnection(connectionName).transaction(async entityManager => {
                    context.set(typeOrmEntityManagerKey, entityManager);

                    try {
                        console.log('Starting Transaction Execution...');
                        const result = await originalMethod.apply(this, [...args]);
                        console.log('Finished Transaction Execution.');

                        return result;
                    } finally {
                        context.set(typeOrmEntityManagerKey, null);
                    }
                });
            } else {
                console.log('Starting Transaction Execution...');
                const result = await originalMethod.apply(this, [...args]);
                console.log('Finished Transaction Execution.');

                return result;
            }
        }
    }
}