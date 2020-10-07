import {stringOrI18n, Environment, getCurrEnv, i18n} from "../internal";

export class Logger {    
    public static log(message: stringOrI18n, logLevel: LogLevel = LogLevel.Info, options: ILoggerOptions = {}) {
        if (!options.bypassShouldLog && !this.shouldLog()) {
            return;
        }

        message = typeof message === "object" ? i18n._(message) : message;
        
        switch (logLevel) {
            case LogLevel.Trace: return console.trace(message);
            case LogLevel.Debug: return console.debug(message);
            case LogLevel.Info: return console.info(message);
            case LogLevel.Warn: return console.warn(message);
            case LogLevel.Error: return console.error(message);
        }
    }
    
    public static trace(message: stringOrI18n, options: ILoggerOptions = {}) {
        return this.log(message, LogLevel.Trace, options);
    }

    public static debug(message: stringOrI18n, options: ILoggerOptions = {}) {
        return this.log(message, LogLevel.Debug, options);
    }

    public static info(message: stringOrI18n, options: ILoggerOptions = {}) {
        return this.log(message, LogLevel.Info, options);
    }

    public static warn(message: stringOrI18n, options: ILoggerOptions = {}) {
        return this.log(message, LogLevel.Warn, options);
    }

    public static error(message: stringOrI18n, options: ILoggerOptions = {}) {
        return this.log(message, LogLevel.Error, options);
    }
    
    private static shouldLog() {
        return [ Environment.LOCAL, Environment.QA ].includes(getCurrEnv());
    }
}

export interface ILoggerOptions {
    bypassShouldLog?: boolean;
}

export enum LogLevel {
    Trace,
    Debug,
    Info,
    Warn,
    Error
}