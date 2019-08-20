import { TweetDetails } from '../interfaces/tweet-details.interface';
import { createCanvas, loadImage, registerFont, PNGStream } from 'canvas';
import { Logger } from '@nestjs/common';
import * as wrap from 'word-wrap';

export class CardImage {
  private tweetDetails: TweetDetails;
  private assetDir: string;
  private pngStream: PNGStream;
  private logger = new Logger('CardImage');

  constructor(tweetDetails: TweetDetails) {
    this.tweetDetails = tweetDetails;
    this.assetDir = __dirname + '/../assets';
  }

  async createCardStream(): Promise<PNGStream> {
    // Assign and register fonts
    await this.registerCardFonts();

    const cardNumber = Math.floor(Math.random() * 4) + 1;
    const cardSource = this.assetDir + '/cardstock/card' + cardNumber + '.png';

    const width = 365;
    const height = 222;

    // Create the image canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Draw carstock image onto context
    const image = await loadImage(cardSource);
    ctx.drawImage(image, 0, 0, width, height);

    ctx.rotate(0.007);

    // Add card content

    await this.writeDateTime(ctx);
    await this.writeElec(ctx);
    // await this.writeCardCallnum(ctx);
    // await this.writeCardText(ctx);
    // await this.writeTrumpism(ctx);

    // Create the image stream
    this.pngStream = canvas.createPNGStream({
      compressionLevel: 6,
      filters: canvas.PNG_ALL_FILTERS,
      palette: undefined,
      backgroundIndex: 0,
      resolution: 96,
    });

    return this.pngStream;
  }

  private writeDateTime(ctx) {
    ctx.fillStyle = '#000';
    ctx.font = '13px freemonobold';
    ctx.fillText(this.tweetDetails.tweet_timestamp, 95, 30);
    return this;
  }

  private writeElec(ctx) {
    const randomAngleFloat = Math.random() * (0.1 - 0.01) + 0.01 - 0.05;
    ctx.fillStyle = '#CA3433';
    ctx.font = '8pt freesansbold';
    ctx.rotate(randomAngleFloat);
    ctx.fillText('ELEC', 10, 20);
    ctx.rotate(randomAngleFloat * -1);
    return this;
  }

  private async registerCardFonts() {
    const cardFontFolder = this.assetDir + '/fonts/';

    // Register fonts
    registerFont(cardFontFolder + 'freemonobold.ttf', { family: 'freemonobold' });
    registerFont(cardFontFolder + 'freesansbold.ttf', { family: 'freesansbold' });
    registerFont(cardFontFolder + 'bftinyhand-regular.ttf', { family: 'bftinyhand-regular' });
  }
}
