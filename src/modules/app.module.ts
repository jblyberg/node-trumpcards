import { Module } from '@nestjs/common';
import { TrumpcardModule } from './trumpcard/trumpcard.module';

@Module({
  imports: [TrumpcardModule],
})
export class AppModule {}
