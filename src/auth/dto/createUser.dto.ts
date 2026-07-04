import {
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20, {
    message: 'Username must be between 3 and 20 character long',
  })
  username?: string;

  @IsEmail({}, { message: 'Please provice a valid email address' })
  email?: string;

  @IsInt()
  @Min(18)
  @Max(60)
  age?: number;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsPhoneNumber('EG')
  @IsOptional()
  phone?: string;
}
