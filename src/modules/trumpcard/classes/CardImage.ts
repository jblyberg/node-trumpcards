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

  async createCardCanvas() {
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
    await this.writeCallnum(ctx);
    await this.writeCardText(ctx);
    await this.writeTrumpism(ctx);

    // return the canvas object;
    return canvas;
  }

  public async cardBuffer() {
    const canvas = await this.createCardCanvas();
    return canvas.toBuffer();
  }

  public async cardStream() {
    const canvas = await this.createCardCanvas();
    const pngStream = canvas.createPNGStream({
      compressionLevel: 6,
      filters: canvas.PNG_ALL_FILTERS,
      palette: undefined,
      backgroundIndex: 0,
      resolution: 96,
    });
    return pngStream;
  }

  private writeDateTime(ctx) {
    ctx.fillStyle = '#242424';
    ctx.font = '13px freemonobold';
    ctx.fillText(this.tweetDetails.timestamp, 95, 30);
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

  private writeCallnum(ctx) {
    ctx.fillStyle = '#CA3433';
    ctx.font = '11pt freemonobold';
    ctx.fillText(this.tweetDetails.callnum, 12, 60);
    return this;
  }

  private writeCardText(ctx) {
    let font = '13px freemonobold';
    let lineLength = 33;
    if (this.tweetDetails.text.length > 140) {
      font = '12px freemonobold';
      lineLength = 34;
    }
    ctx.fillStyle = '#242424';
    ctx.font = font;
    ctx.fillText(wrap(this.tweetDetails.text, { width: lineLength, indent: '' }), 95, 53);
    return this;
  }

  private writeTrumpism(ctx) {
    const trumpism = wrap(this.tweetDetails.trumpism, { width: 40, indent: '' });
    const randomAngleFloat = Math.random() * (0.015 + 0.015) - 0.015;
    ctx.fillStyle = '#27276b';
    ctx.font = '10px bftinyhand-regular';
    ctx.rotate(randomAngleFloat);
    ctx.fillText(trumpism, 25, 172);
    ctx.rotate(randomAngleFloat * -1);
  }

  private async registerCardFonts() {
    const cardFontFolder = this.assetDir + '/fonts/';

    // Register fonts
    registerFont(cardFontFolder + 'freemonobold.ttf', { family: 'freemonobold' });
    registerFont(cardFontFolder + 'freesansbold.ttf', { family: 'freesansbold' });
    registerFont(cardFontFolder + 'bftinyhand-regular.ttf', { family: 'bftinyhand-regular' });
  }
}
