export interface IBaseExceptionInfo {
    message: string;
}

export class BaseException extends Error {
    public getDetails(): IBaseExceptionInfo {
        return {
            message: this.message
        }
    };
}