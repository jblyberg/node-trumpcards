import { Module } from '@nestjs/common';
import { TrumpcardController } from './trumpcard.controller';
import { TrumpcardService } from './trumpcard.service';
import { ScheduleService } from './schedule.service';
import { ScheduleModule } from 'nest-schedule';

@Module({
  controllers: [TrumpcardController],
  imports: [ScheduleModule.register()],
  providers: [TrumpcardService, ScheduleService],
})
export class TrumpcardModule {}
