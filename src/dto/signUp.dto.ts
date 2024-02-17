import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  //   isStrongPassword,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  //   @isStrongPassword({
  //     minLength: 8,
  //     minLowercase: 0,
  //     minNumbers: 1,
  //     minSymbols: 1,
  //     minUppercase: 0,
  //   })
  password: string;

  @IsOptional()
  @IsString()
  name: string;
}
