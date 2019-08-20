import { Controller, Logger, Get, Post, UsePipes, ValidationPipe, Body, Header, Res } from '@nestjs/common';
import { TrumpcardService } from './trumpcard.service';
import { CreateCardDto } from './dto/create-card.dto';
import { TrumpCardTokenValidationPipe } from './pipes/card-token-validation.pipe';
// tslint:disable-next-line: no-implicit-dependencies
import { Response } from 'express';

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
    this.logger.verbose(`Creating a new card.`);
    return this.trumpcardService.tweetCard(createCardDto);
  }

  @Post('/card')
  @Header('Content-Type', 'image/png')
  async streamCard(@Body() createCardDto: CreateCardDto, @Res() response: Response) {
    const cardStream = await this.trumpcardService.tweetCard(createCardDto);

    response.setHeader('Content-Disposition', 'attachment; filename=card.png');

    cardStream.pipe(response);
  }
}
