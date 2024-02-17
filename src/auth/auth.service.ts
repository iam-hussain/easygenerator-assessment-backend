import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  UnprocessableEntityException,
  NotAcceptableException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/createUser.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{
    access_token: string;
  }> {
    const user = await this.usersService.findOne({ email });
    if (!user || !user.email) {
      throw new BadRequestException();
    }
    if (user.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(userInput: CreateUserDto): Promise<{
    access_token: string;
  }> {
    try {
      const user = await this.usersService.create(userInput);
      const payload = { sub: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new NotAcceptableException();
        }
      }
      throw new UnprocessableEntityException();
    }
  }
}
