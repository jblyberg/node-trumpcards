import { IsNotEmpty, IsUrl } from 'class-validator';

export class TweetAuthorDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
