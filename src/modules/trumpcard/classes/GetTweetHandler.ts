import * as Twit from 'twit';
import * as config from 'config';
import { Logger } from '@nestjs/common';
import * as emojiStrip from 'emoji-strip';
import { TweetDetails } from '../interfaces/tweet-details.interface';
import { default as trumpisms } from '../../../data/trumpisms.map';
import * as moment from 'moment-timezone';

export class GetTweetHandler {
  private twitterConfig = config.get('twitter');
  private Twitter = new Twit(this.twitterConfig);
  private logger = new Logger('TweetHandler');

  async fetchTweet(tweetId: string): Promise<TweetDetails> {
    const response = await this.Twitter.get('statuses/show/:id', { id: tweetId, tweet_mode: 'extended' });
    const tweetDetails = await this.parseTweetDetails(response);
    return tweetDetails;
  }

  parseTweetDetails({ data }): TweetDetails {
    const tweetDetails = {
      is_retweet: data.retweeted_status ? true : false,
      tweet_timestamp: this.extractTimestamp(data.created_at),
      text: this.extractText(data.full_text),
      hashtags: this.extractHashtags(data.entities.hashtags),
      mentions: this.extractMentions(data.entities.user_mentions),
      trumpism: this.randomTrumpism(),
    };
    return tweetDetails;
  }

  private extractText(tweetText: string): string {
    tweetText = emojiStrip(tweetText);
    tweetText = tweetText.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    tweetText = tweetText.replace(/(\r\n|\n|\r)/gm, ' ');
    tweetText = tweetText.replace(/  /gm, ' ').trim();

    return tweetText;
  }

  private extractHashtags(hashTagArr: Array<any>): Array<string> {
    const hashTags = [];
    if (hashTagArr.length) {
      hashTagArr.forEach(h => {
        hashTags.push(h.text);
      });
    }
    return hashTags;
  }

  private extractMentions(mentionsArr: Array<any>): Array<string> {
    const mentions = [];
    if (mentionsArr.length) {
      mentionsArr.forEach(m => {
        mentions.push(m.screen_name);
      });
    }
    // de-dupe
    return [...new Set(mentions)];
  }

  private randomTrumpism(): string {
    const trumpism = trumpisms.crazyshit[Math.floor(Math.random() * trumpisms.crazyshit.length)];
    return trumpism;
  }

  private extractTimestamp(dateUnformatted: string): string {
    const dateObj = moment(dateUnformatted, 'ddd MMM DD HH:mm:ss ZZ YYYY');
    const formattedDate = dateObj.tz('America/New_York').format('MMMM Do, YYYY [at] h:mm A');
    return formattedDate;
  }
}
