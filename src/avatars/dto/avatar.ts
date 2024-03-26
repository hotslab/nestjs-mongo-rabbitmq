import { IsNotEmpty } from 'class-validator';

export class AvatarType {
  _id: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  hash: string;

  @IsNotEmpty()
  file: string;
}
