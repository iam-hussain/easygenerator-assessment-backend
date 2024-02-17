import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInDto } from '../dto/signIn.dto';
import { SignUpDto } from 'src/dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp({ ...signUpDto, salt: 'some' });
  }

  @Get('check')
  getProfile(@Request() req) {
    return req.user;
  }
}
