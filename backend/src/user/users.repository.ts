import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersRepository extends BaseRepository<User, string> {
  constructor(
    protected readonly prisma: PrismaService
  ) {
    super(prisma, prisma.user);
  }

  async findById(id: string): Promise<User | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.model.findMany();
  }

  async create(data: Partial<User>): Promise<User> {
    return this.model.create({ data });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.model.delete({ where: { id } });
  }

  // Additional method specific to UsersRepository
  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({ where: { email } });
  }
}