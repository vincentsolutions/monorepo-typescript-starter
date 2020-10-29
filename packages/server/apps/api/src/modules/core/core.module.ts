import {Global, Module} from '@nestjs/common';
import {DefaultValidationPipe} from "./pipes/validation/default-validation.pipe";
import {CryptoService} from "./services/crypto.service";
import {Config} from "./config/config";
import {Logger} from "./services/logger.service";
import {CqrsModule} from "@nestjs/cqrs";

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
