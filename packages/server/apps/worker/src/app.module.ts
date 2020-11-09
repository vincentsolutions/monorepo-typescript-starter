import {Module} from '@nestjs/common';
import {BullModule} from "@nestjs/bull";
import {CoreModule as SharedCoreModule, coreConstants } from "@server/core";
import { CoreModule } from './modules/core/core.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import * as ormConfig from "../../../ormconfig";
import { JobModule } from './modules/jobs/job.module';

@Module({
  imports: [
      SharedCoreModule,
      TypeOrmModule.forRoot(ormConfig),
      BullModule.forRoot({ redis: coreConstants.redisSettings }),
      JobModule,
      CoreModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
