import { Module } from '@nestjs/common';
import { TrumpcardController } from './trumpcard.controller';
import { TrumpcardService } from './trumpcard.service';

@Module({
  controllers: [TrumpcardController],
  providers: [TrumpcardService],
})
export class TrumpcardModule {}
