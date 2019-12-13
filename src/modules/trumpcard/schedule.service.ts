import { Injectable } from '@nestjs/common';
import { Interval, NestSchedule } from 'nest-schedule';
import { TrumpcardService } from './trumpcard.service';

@Injectable()
export class ScheduleService extends NestSchedule {
  constructor(private trumpcardService: TrumpcardService) {
    super();
    this.trumpcardService.checkTimeline();
  }

  @Interval(20000)
  checkTimeline() {
    this.trumpcardService.checkTimeline();
  }
}
