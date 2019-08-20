import * as Twit from 'twit';
import * as config from 'config';
import * as emojiStrip from 'emoji-strip';
import * as moment from 'moment-timezone';
import { default as cardConfig } from '../../../data/trumpisms.map';
import { TweetDetails } from '../interfaces/tweet-details.interface';

export class GetTweetHandler {
  private twitterConfig = config.get('twitter');
  private twitter = new Twit(this.twitterConfig);

  async fetchTweet(tweetId: string): Promise<TweetDetails> {
    const response = await this.twitter.get('statuses/show/:id', { id: tweetId, tweet_mode: 'extended' });
    const tweetDetails = await this.parseTweetDetails(response);
    return tweetDetails;
  }

  private parseTweetDetails({ data }): TweetDetails {
    const tweetDetails = {
      is_retweet: data.retweeted_status ? true : false,
      timestamp: this.extractTimestamp(data.created_at),
      text: this.extractText(data.full_text),
      hashtags: this.extractHashtags(data.entities.hashtags),
      mentions: this.extractMentions(data.entities.user_mentions),
      trumpism: this.randomTrumpism(),
      callnum: this.assignCallnum(),
    };
    return tweetDetails;
  }

  private extractText(tweetText: string): string {
    tweetText = emojiStrip(tweetText);
    tweetText = tweetText.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    tweetText = tweetText.replace(/(\r\n|\n|\r)+/gm, String.fromCharCode(10));
    tweetText = tweetText.replace(/  /gm, ' ').trim();
    tweetText = this.decodeEntities(tweetText);

    return tweetText;
  }

  private extractHashtags(hashTagArr: any[]): string[] {
    const hashTags = [];
    if (hashTagArr.length) {
      hashTagArr.forEach(h => {
        hashTags.push(h.text);
      });
    }
    return hashTags;
  }

  private extractMentions(mentionsArr: any[]): string[] {
    const mentions = [];
    if (mentionsArr.length) {
      mentionsArr.forEach(m => {
        mentions.push(m.screen_name);
      });
    }
    // de-dupe
    return [...new Set(mentions)];
  }

  private extractTimestamp(dateUnformatted: string): string {
    const dateObj = moment(dateUnformatted, 'ddd MMM DD HH:mm:ss ZZ YYYY');
    const formattedDate = dateObj.tz('America/New_York').format('MMMM Do, YYYY [at] h:mm A');
    return formattedDate;
  }

  private randomTrumpism(): string {
    const trumpism = cardConfig.trumpisms[Math.floor(Math.random() * cardConfig.trumpisms.length)];
    return trumpism;
  }

  private assignCallnum(): string {
    const dewey = cardConfig.dewey[Math.floor(Math.random() * cardConfig.dewey.length)];
    return 'TRU' + String.fromCharCode(10) + dewey;
  }

  private decodeEntities(encodedString: string): string {
    const translateRegex = /&(nbsp|amp|quot|lt|gt);/g;
    const translate = {
      nbsp: ' ',
      amp: '&',
      quot: '"',
      lt: '<',
      gt: '>',
    };
    return encodedString
      .replace(translateRegex, (match, entity) => {
        return translate[entity];
      })
      .replace(/&#(\d+);/gi, (match, numStr) => {
        const num = parseInt(numStr, 10);
        return String.fromCharCode(num);
      });
  }
}
