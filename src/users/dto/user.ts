import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserType {
  _id: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
