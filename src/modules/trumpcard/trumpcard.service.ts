import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { GetTweetHandler } from './classes/GetTweetHandler';
import * as urlParse from 'url-parse';
import { CardImage } from './classes/CardImage';
import { PostTweetHandler } from './classes/PostTweetHandler';
import { PNGStream } from 'canvas';

@Injectable()
export class TrumpcardService {
  tweetObj: object;

  async tweetCard(createCardDto: CreateCardDto) {
    const tweetDetails = await this.getTweetDetails(createCardDto);

    // If it's a re-tweet, we don't make a card.
    if (tweetDetails.is_retweet) {
      return null;
    }

    // Create the card image canvas object
    const cardImage = new CardImage(tweetDetails);

    // Create the outgoing tweet and send it.
    const postTweetHandler = new PostTweetHandler(tweetDetails, cardImage);
    postTweetHandler.postTweet();
  }

  async cardStream(createCardDto: CreateCardDto) {
    const tweetDetails = await this.getTweetDetails(createCardDto);
    const cardImage = new CardImage(tweetDetails);
    return cardImage.cardStream();
  }

  private async getTweetDetails(createCardDto: CreateCardDto) {
    // Parse the tweet ID from the incoming request
    const tweetId: string = urlParse(createCardDto.tweetData.url).pathname.split('/')[3];

    // Fetch the tweet from the twitter API and create a TweetDetails object
    const getTweetHandler = new GetTweetHandler();
    const tweetDetails = await getTweetHandler.fetchTweet(tweetId);

    return tweetDetails;
  }
}
