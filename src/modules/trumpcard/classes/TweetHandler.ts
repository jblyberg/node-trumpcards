import * as Twit from 'twit';
import * as config from 'config';
import { Logger } from '@nestjs/common';

export class TweetHandler {
  private twitterConfig = config.get('twitter');
  private Twitter = new Twit(this.twitterConfig);
  private logger = new Logger('TweetHandler');

  async fetchTweet(tweetId: string): Promise<Twit.PromiseResponse> {
    const response = await this.Twitter.get('statuses/show/:id', { id: tweetId, tweet_mode: 'extended' });
    return response;
  }
}
