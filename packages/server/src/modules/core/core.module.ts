import {Global, Logger, Module} from '@nestjs/common';
import {DefaultValidationPipe} from "./pipes/validation/default-validation.pipe";
import {CryptoService} from "./services/crypto.service";

@Global()
@Module({
    providers: [
        Logger,
        CryptoService
    ],
    imports: [DefaultValidationPipe],
    exports: [
        DefaultValidationPipe,
        Logger,
        CryptoService
    ]
})
export class CoreModule {}
