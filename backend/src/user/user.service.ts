import { Injectable, ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { 
  NotFoundException,
  UnauthorizedException,
  ValidationException 
} from '../../common/exceptions/http.exception';

type UserResponse = {
  data: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  private excludePassword<T extends User>(user: T): Omit<T, 'password'> {
    if (!user) throw new NotFoundException('User not found');
    const { password, ...result } = user;
    return result;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    // Check if user with email already exists
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    try {
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      console.log('Created user:', user.id);

      return { data: this.excludePassword(user) };
    } catch (error) {
      throw new ValidationException('Failed to create user', error.message);
    }
  }

  async findAll(): Promise<UserResponse> {
    try {
      const users = await this.usersRepository.findAll();
      return {
        data: users.map(user => this.excludePassword(user))
      };
    } catch (error) {
      throw new ValidationException('Failed to fetch users', error.message);
    }
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { data: this.excludePassword(user) };
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.usersRepository.findByEmail(email);
    } catch (error) {
      throw new ValidationException('Failed to find user by email', error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    // Check if user exists
    await this.findOne(id);

    try {
      // If password is being updated, hash it
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const updatedUser = await this.usersRepository.update(id, updateUserDto);
      return { data: this.excludePassword(updatedUser) };
    } catch (error) {
      throw new ValidationException('Failed to update user', error.message);
    }
  }

  async remove(id: string): Promise<{ data: { deleted: boolean } }> {
    await this.findOne(id);
    try {
      await this.usersRepository.delete(id);
      return { data: { deleted: true } };
    } catch (error) {
      throw new ValidationException('Failed to delete user', error.message);
    }
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.excludePassword(user);
  }
}