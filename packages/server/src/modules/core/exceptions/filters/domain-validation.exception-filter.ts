import {ArgumentsHost, Catch, ExceptionFilter} from "@nestjs/common";
import {DomainValidationException} from "../impl/domain-validation.exception";

@Catch(DomainValidationException)
export class DomainValidationExceptionFilter implements ExceptionFilter {

    catch(exception: DomainValidationException, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = 422;

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                type: 'DomainValidationException',
                message: exception.message
            })
    }
}