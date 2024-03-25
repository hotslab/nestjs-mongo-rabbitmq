import { IsNotEmpty } from 'class-validator';

export class AvatarType {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  hash: string;

  @IsNotEmpty()
  file: string;
}
