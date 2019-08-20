import * as Twit from 'twit';
import { CardImage } from './CardImage';
import { TweetDetails } from '../interfaces/tweet-details.interface';
import * as fs from 'fs';
import * as config from 'config';
import { Logger } from '@nestjs/common';

export class PostTweetHandler {
  private twitterConfig = config.get('twitter');
  private twitter = new Twit(this.twitterConfig);
  private tweetDetails: TweetDetails;
  private cardImage: CardImage;

  private logger = new Logger('PostTweetHandler');

  constructor(tweetDetails: TweetDetails, cardImage: CardImage) {
    this.tweetDetails = tweetDetails;
    this.cardImage = cardImage;
  }

  public async postTweet() {
    const cardImageBuffer = await this.cardImage.cardBuffer();
    const b64content = cardImageBuffer.toString('base64');

    this.twitter.post('media/upload', { media_data: b64content }, (mediaUploadError, data) => {
      const mediaIdStr = data.media_id_string;
      const altText = this.tweetDetails.text;
      const metaParams = { media_id: mediaIdStr, alt_text: { text: altText } };

      this.twitter.post('media/metadata/create', metaParams, metadataCreateError => {
        if (!metadataCreateError) {
          const twitterStatus = this.tweetDetails.timestamp;
          const params = { status: this.formatTweetStatus(), media_ids: [mediaIdStr] };

          this.twitter.post('statuses/update', params, twitterPostError => {
            if (!twitterPostError) {
              this.logger.verbose('Card tweeted successfully.');
            } else {
              this.logger.error('Unable to tweet card.');
            }
          });
        }
      });
    });
  }

  private formatTweetStatus() {
    let tweetStatus = this.tweetDetails.timestamp;

    if (this.tweetDetails.mentions.length) {
      let mentions = '';
      this.tweetDetails.mentions.forEach(mention => {
        mentions = mentions.concat('@' + mention + ' ');
      });
      tweetStatus = tweetStatus.concat(String.fromCharCode(10) + mentions.trim());
    }

    if (this.tweetDetails.hashtags.length) {
      let hashtags = '';
      this.tweetDetails.hashtags.forEach(hashtag => {
        hashtags = hashtags.concat('#' + hashtag + ' ');
      });
      tweetStatus = tweetStatus.concat(String.fromCharCode(10) + hashtags.trim());
    }

    return tweetStatus;
  }
}
