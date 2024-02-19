import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  UnprocessableEntityException,
  PreconditionFailedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { pbkdf2Sync, generateKeySync } from 'crypto';
import { SignUpDto } from 'src/dto/signUp.dto';

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
    const validatePassword = this.verifyPasswordHash(
      password,
      user.password,
      user.salt,
    );
    if (!validatePassword) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(userInput: SignUpDto): Promise<{
    access_token: string;
  }> {
    try {
      const [hash, salt] = this.generatePasswordHash(userInput.password);
      const user = await this.usersService.create({
        ...userInput,
        password: hash,
        salt,
      });
      const payload = { sub: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new PreconditionFailedException();
        }
      }
      throw new UnprocessableEntityException();
    }
  }

  private passwordHashWithSalt(input: string, salt: string) {
    return pbkdf2Sync(input, salt, 1000, 64, `sha512`).toString(`hex`);
  }

  private generatePasswordHash(password: string) {
    const salt = generateKeySync('hmac', { length: 512 })
      .export()
      .toString('hex');

    return [this.passwordHashWithSalt(password, salt), salt];
  }

  private verifyPasswordHash(password: string, hash: string, salt: string) {
    const passwordHash = this.passwordHashWithSalt(password, salt);
    return hash === passwordHash;
  }
}
