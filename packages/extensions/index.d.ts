declare interface String {

}

declare interface Number {

}

declare interface Function {

}

declare interface Option {

}

declare interface Array<T> {
    firstOrDefault(pre?: (this: void, value: T, index: number, obj: T[]) => value is T, defaultValue?: T): T | undefined;
}

declare type Nullable<T> = T | null;
