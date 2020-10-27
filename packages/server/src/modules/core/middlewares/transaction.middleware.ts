import {Injectable, NestMiddleware} from "@nestjs/common";
import {Request, Response} from "express";
import {clsNamespace} from "../../../main";

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void): any {
        clsNamespace.run(() => next());
    }
}