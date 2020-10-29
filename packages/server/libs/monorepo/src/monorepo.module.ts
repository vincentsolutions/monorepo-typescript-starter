import { Module } from '@nestjs/common';
import { MonorepoService } from './monorepo.service';

@Module({
  providers: [MonorepoService],
  exports: [MonorepoService],
})
export class MonorepoModule {}
