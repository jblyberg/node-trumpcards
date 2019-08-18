import { Controller, Logger, Get, Post, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { TrumpcardService } from './trumpcard.service';
import { CreateCardDto } from './dto/create-card.dto';
import { TrumpCardTokenValidationPipe } from './pipes/card-token-validation.pipe';

@Controller()
export class TrumpcardController {
  private logger = new Logger('TrumpcardController');

  constructor(private trumpcardService: TrumpcardService) {}

  @Get()
  fuckTrump(): object {
    const response = {
      fact: 'Donald Trump is a racist.',
    };
    return response;
  }

  @Post('/newtweet')
  @UsePipes(TrumpCardTokenValidationPipe, ValidationPipe)
  createCard(@Body() createCardDto: CreateCardDto) {
    this.logger.verbose(`Creating a new card. Data: ${JSON.stringify(createCardDto)}`);
    return this.trumpcardService.createCard(createCardDto);
  }
}
