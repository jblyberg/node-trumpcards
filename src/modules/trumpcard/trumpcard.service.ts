import { PNGStream } from 'canvas';
import * as urlParse from 'url-parse';
import { Injectable, Logger } from '@nestjs/common';
import { CardImage } from './classes/CardImage';
import { CreateCardDto } from './dto/create-card.dto';
import { GetTweetHandler } from './classes/GetTweetHandler';
import { PostTweetHandler } from './classes/PostTweetHandler';
import { TweetDetails } from './interfaces/tweet-details.interface';

@Injectable()
export class TrumpcardService {
  private logger = new Logger('TrumpcardService');

  async checkTimeline(): Promise<void> {
    // Fetch timeline data
    const getTweetHandler = new GetTweetHandler();
    const tweetDetails = await getTweetHandler.fetchTimeline();

    // Trump has not tweeted, do nothing
    if (tweetDetails === false) {
      this.logger.verbose('Trump has not tweeted.');
      return;
    }

    // Create cards for any new tweets
    for (let tweet of tweetDetails) {
      this.tweetCard(tweet);
    }

    return;
  }

  async tweetCard(tweetDetails: TweetDetails): Promise<void> {
    // Create the card image canvas object
    const cardImage = new CardImage(tweetDetails);

    // Create the outgoing tweet and send it.
    const postTweetHandler = new PostTweetHandler(tweetDetails, cardImage);
    try {
      postTweetHandler.postTweet();
      this.logger.log('Trump has tweeted: Card created. 💩');
    } catch (error) {
      this.logger.error('Trump has tweeted but was unable to post a card.');
    }
  }

  async cardStream(createCardDto: CreateCardDto): Promise<PNGStream> {
    const tweetDetails = await this.getTweetDetails(createCardDto);
    const cardImage = new CardImage(tweetDetails);
    return cardImage.cardStream();
  }

  private async getTweetDetails(createCardDto: CreateCardDto): Promise<TweetDetails> {
    // Parse the tweet ID from the incoming request
    const tweetId: string = urlParse(createCardDto.tweetData.url).pathname.split('/')[3];

    // Fetch the tweet from the twitter API and create a TweetDetails object
    const getTweetHandler = new GetTweetHandler();
    const tweetDetails = await getTweetHandler.fetchTweet(tweetId);

    return tweetDetails;
  }
}
