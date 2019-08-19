import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { GetTweetHandler } from './classes/GetTweetHandler';
import * as urlParse from 'url-parse';

@Injectable()
export class TrumpcardService {
  tweetObj: object;

  async tweetCard(createCardDto: CreateCardDto) {
    const tweetId: string = urlParse(createCardDto.tweetData.url).pathname.split('/')[3];
    const getTweetHandler = new GetTweetHandler();

    const tweetDetails = await getTweetHandler.fetchTweet(tweetId);
    return tweetDetails;
  }
}
