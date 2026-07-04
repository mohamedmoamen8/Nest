import { IsEmail, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email: string;

  @IsString()
  @Length(8, 32, { message: 'Password must be between 8 and 32 characters' })
  password: string;
}
