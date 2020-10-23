import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import {Request} from "express";
import {Logger} from "../services/logger.service";
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
        const methodAndPath = `${request.method.toUpperCase()} ${request.path.toUpperCase()}`;

        const now = moment();

        this.logger.log(`[WEB REQUEST] ${methodAndPath} Started @ ${now.format('lll')}`);

        return next
            .handle()
            .pipe(
                tap(() => {
                    const durationInMs = moment().diff(now, 'millisecond');

                    this.logger.log(`[WEB REQUEST] ${methodAndPath} Ended @ ${now.format('lll')} (${durationInMs}ms ago)`);
                })
            );
    }

}