import { PipeTransform, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateCardDto } from '../dto/create-card.dto';
import * as config from 'config';

export class TrumpCardTokenValidationPipe implements PipeTransform {
  /**
   * Checks to make sure request has correct token
   *
   * @param value : string
   */
  transform(createCardDto: CreateCardDto) {
    const authConfig = config.get('auth');

    if (!createCardDto.token) {
      throw new BadRequestException(`You must provide an authentication token.`);
    }

    if (createCardDto.token !== authConfig.token) {
      throw new UnauthorizedException('Invalid token.');
    }

    return createCardDto;
  }
}
