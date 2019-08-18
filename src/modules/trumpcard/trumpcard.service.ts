import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class TrumpcardService {
  async createCard(createCardDto: CreateCardDto) {
    return createCardDto;
  }
}
