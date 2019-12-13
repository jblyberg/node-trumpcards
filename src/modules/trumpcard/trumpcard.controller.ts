import { Controller, Post, UsePipes, ValidationPipe, Body, Header, Res } from '@nestjs/common';
import { TrumpcardService } from './trumpcard.service';
import { CreateCardDto } from './dto/create-card.dto';
import { TrumpCardTokenValidationPipe } from './pipes/card-token-validation.pipe';
// tslint:disable-next-line: no-implicit-dependencies
import { Response } from 'express';

@Controller()
export class TrumpcardController {
  constructor(private trumpcardService: TrumpcardService) {}

  /**
   * This is a development endpoint for working on card images. Disabled in production.
   *
   * @param createCardDto Card details
   * @param response Card image stream
   */
  @Post('/card')
  @UsePipes(TrumpCardTokenValidationPipe, ValidationPipe)
  @Header('Content-Type', 'image/png')
  async streamCard(@Body() createCardDto: CreateCardDto, @Res() response: Response) {
    const cardStream = await this.trumpcardService.cardStream(createCardDto);

    response.setHeader('Content-Disposition', 'attachment; filename=card.png');

    cardStream.pipe(response);
  }
}
