import { PNGStream } from 'canvas';
import * as urlParse from 'url-parse';
import { Injectable } from '@nestjs/common';
import { CardImage } from './classes/CardImage';
import { CreateCardDto } from './dto/create-card.dto';
import { GetTweetHandler } from './classes/GetTweetHandler';
import { PostTweetHandler } from './classes/PostTweetHandler';
import { TweetDetails } from './interfaces/tweet-details.interface';

@Injectable()
export class TrumpcardService {
  async tweetCard(createCardDto: CreateCardDto): Promise<object> {
    const result = { tweeted: false };
    const tweetDetails = await this.getTweetDetails(createCardDto);

    // If it's a re-tweet, we don't make a card.
    if (tweetDetails.is_retweet) {
      return result;
    }

    // Create the card image canvas object
    const cardImage = new CardImage(tweetDetails);

    // Create the outgoing tweet and send it.
    const postTweetHandler = new PostTweetHandler(tweetDetails, cardImage);
    postTweetHandler.postTweet();

    result.tweeted = true;
    return result;
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
