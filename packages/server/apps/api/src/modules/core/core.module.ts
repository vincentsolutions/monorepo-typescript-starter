import {Global, Module} from '@nestjs/common';
import {DefaultValidationPipe} from "./pipes/validation/default-validation.pipe";
import {Config} from "./config/config";
import {CqrsModule} from "@nestjs/cqrs";
import {CryptoService, Logger} from "@server/core";

@Global()
@Module({
    imports: [DefaultValidationPipe, CqrsModule],
    providers: [
        Logger,
        CryptoService,
        Config
    ],
    exports: [
        DefaultValidationPipe,
        Logger,
        CryptoService,
        Config
    ]
})
export class CoreModule {}
