import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import {Request} from "express";
import {Logger} from "@server/core";
import * as moment from "moment";
import {tap} from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    constructor(
        private readonly logger: Logger
    ) {
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
        const httpContext = context.switchToHttp();

        const request = httpContext.getRequest<Request>();
        const logMessagePrefix = `[WEB REQUEST] ${request.method.toUpperCase()} ${request.path}`;

        const now = moment();

        this.logger.log(`${logMessagePrefix} Started @ ${now.format('ll HH:mm:ss.SSS')}`);

        return next
            .handle()
            .pipe(
                tap(() => {
                    const durationInMs = moment().diff(now, 'millisecond');

                    this.logger.log(`${logMessagePrefix} Ended @ ${now.format('ll HH:mm:ss.SSS')} (${durationInMs}ms ago)`);
                })
            );
    }

}