import {Global, Logger, Module} from '@nestjs/common';
import {DefaultValidationPipe} from "./pipes/validation/default-validation.pipe";
import {CryptoService} from "./services/crypto.service";
import {Config} from "./config/config";

@Global()
@Module({
    providers: [
        Logger,
        CryptoService,
        Config
    ],
    imports: [DefaultValidationPipe],
    exports: [
        DefaultValidationPipe,
        Logger,
        CryptoService,
        Config
    ]
})
export class CoreModule {}
