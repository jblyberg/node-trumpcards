import { IsNotEmpty, ValidateNested, IsUrl } from 'class-validator';
import { TweetAuthorDto } from './tweet-author.dto';

export class TweetDataDto {
  @IsNotEmpty()
  datetime: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @ValidateNested()
  author: TweetAuthorDto;

  @IsNotEmpty()
  description: string;
}
