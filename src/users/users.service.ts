import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const user = this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    return user;
  }

  async create(user: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...user,
      },
    });
  }
}
