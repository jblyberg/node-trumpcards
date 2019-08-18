import { IsNotEmpty, ValidateNested } from 'class-validator';
import { TweetDataDto } from './tweet-data.dto';

export class CreateCardDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @ValidateNested()
  tweetData: TweetDataDto;
}
