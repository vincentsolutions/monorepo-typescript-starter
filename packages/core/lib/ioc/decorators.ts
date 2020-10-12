import getDecorators from "inversify-inject-decorators";
import {container} from "./container";
import {interfaces} from "inversify";

const DECORATORS = getDecorators(container);

interface IBabelPropertyDescriptor extends PropertyDescriptor {
    initializer(): any;
}

export const lazyInject = function (serviceIdentifier: interfaces.ServiceIdentifier<any>) {
    const original = DECORATORS.lazyInject(serviceIdentifier);

    return function (this: any, proto: any, key: string, descriptor?: IBabelPropertyDescriptor): void {
        original.call(this, proto, key);

        descriptor!.initializer = function () {
            return proto[key];
        }
    }
}

export const lazyInjectNamed = function (serviceIdentifier: interfaces.ServiceIdentifier<any>, named: string) {
    const original = DECORATORS.lazyInjectNamed(serviceIdentifier, named);

    return function (this: any, proto: any, key: string, descriptor?: IBabelPropertyDescriptor): void {
        original.call(this, proto, key);

        descriptor!.initializer = function () {
            return proto[key];
        }
    }
}

export const lazyInjectTagged = function (serviceIdentifier: interfaces.ServiceIdentifier<any>, key: string, value: string) {
    const original = DECORATORS.lazyInjectTagged(serviceIdentifier, key, value);

    return function (this: any, proto: any, key: string, descriptor?: IBabelPropertyDescriptor): void {
        original.call(this, proto, key);

        descriptor!.initializer = function () {
            return proto[key];
        }
    }
}

export const lazyMultiInject = function (serviceIdentifier: interfaces.ServiceIdentifier<any>) {
    const original = DECORATORS.lazyMultiInject(serviceIdentifier);

    return function (this: any, proto: any, key: string, descriptor?: IBabelPropertyDescriptor): void {
        original.call(this, proto, key);

        descriptor!.initializer = function () {
            return proto[key];
        }
    }
}