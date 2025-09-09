// src/common/repositories/base.repository.ts
import { PrismaService } from '../../prisma/prisma.service';

export abstract class BaseRepository<T, ID = string> {
  protected model: any;  // Prisma model delegate
  
  constructor(
    protected readonly prisma: PrismaService,
    model: any
  ) {
    this.model = model;
  }

  abstract findById(id: ID): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract create(data: Partial<T>): Promise<T>;
  abstract update(id: ID, data: Partial<T>): Promise<T>;
  abstract delete(id: ID): Promise<void>;
}
