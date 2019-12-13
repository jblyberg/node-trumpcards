import { Injectable, Logger } from '@nestjs/common';
import { Interval, NestSchedule } from 'nest-schedule';
import { TrumpcardService } from './trumpcard.service';
import * as config from 'config';

@Injectable()
export class ScheduleService extends NestSchedule {
  private logger = new Logger('ScheduleService');

  constructor(private trumpcardService: TrumpcardService) {
    super();
    this.logger.log('Watching for Trump tweets. 👶🏼');
  }

  @Interval(config.get('app').polling_interval * 1000)
  checkTimeline() {
    this.trumpcardService.checkTimeline();
  }
}
