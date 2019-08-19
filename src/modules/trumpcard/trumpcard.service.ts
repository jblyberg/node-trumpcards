import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { TweetHandler } from './classes/TweetHandler';
import * as emojiStrip from 'emoji-strip';
import * as urlParse from 'url-parse';
import * as Twit from 'twit';

@Injectable()
export class TrumpcardService {
  tweetObj: object;

  async tweetCard(createCardDto: CreateCardDto) {
    const tweetId = urlParse(createCardDto.tweetData.url).pathname.split('/')[3];
    const tweetHandler = new TweetHandler();

    const tweet = await tweetHandler.fetchTweet(tweetId);
    return tweet;
  }
}
