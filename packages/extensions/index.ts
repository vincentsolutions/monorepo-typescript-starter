/// <reference path="index.d.ts" />

Array.prototype.firstOrDefault = function <T>(pred?: (this: void, value: T, index: number, obj: T[]) => value is T, defaultValue?: T): T | undefined {
    if (this === null || this.length === 0) {
        return;
    }

    if (!pred) {
        return this[0];
    }

    return this.find(pred) ?? defaultValue;
}