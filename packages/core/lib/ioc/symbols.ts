import {AuthApi, UsersApi} from "../internal";

export const Symbols = {
    apis: {
        auth: Symbol.for(`I${AuthApi.name}`),
        users: Symbol.for(`I${UsersApi.name}`)
    },
    constants: {
        history: Symbol.for(History.name)
    }
}