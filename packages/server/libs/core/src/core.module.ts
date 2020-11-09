import {Module} from '@nestjs/common';
import {CoreModule} from "./modules/core/core.module";
import {EmailModule} from "./modules/email/email.module";

@Module({
  imports: [
      CoreModule,
      EmailModule
  ],
  exports: [
      CoreModule
  ],
})
export class ServerCoreModule {}
