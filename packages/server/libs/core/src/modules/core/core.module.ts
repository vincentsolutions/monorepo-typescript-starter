import {Global, Module} from '@nestjs/common';
import {CryptoService} from "./services/crypto.service";
import {Logger} from "./services/logger.service";

@Global()
@Module({
  providers: [
      CryptoService,
      Logger
  ],
  exports: [
      CryptoService,
      Logger
  ],
})
export class CoreModule {}
