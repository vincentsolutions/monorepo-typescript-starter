import {Module} from '@nestjs/common';
import {BullModule, BullModuleOptions} from "@nestjs/bull";
import {QUEUE_NAMES} from "./job.constants";
import {EmailJobService} from "./jobs/email/email-job.service";

const queueRegistrationOptions: BullModuleOptions[] = [];

for (const key in QUEUE_NAMES) {
    queueRegistrationOptions.push({ name: QUEUE_NAMES[key] });
}

@Module({
  imports: [
      BullModule.registerQueue(...queueRegistrationOptions)
  ],
  providers: [
      EmailJobService
  ],
  exports: [
      BullModule.registerQueue(...queueRegistrationOptions),
      EmailJobService
  ],
})
export class JobLibModule {}
