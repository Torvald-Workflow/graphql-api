import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';

const BCRYPT_SALT = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = new User();

    user.email = data.email;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.password = await bcrypt.hash(data.password, BCRYPT_SALT);
    user.createdAt = new Date();

    return this.usersRepository.save(user);
  }

  async createDefaultAdminUser(data: CreateUserDto): Promise<User> {
    const user = new User();

    user.email = data.email;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.password = await bcrypt.hash(data.password, BCRYPT_SALT);
    user.isAdmin = true;
    user.createdAt = new Date();

    return this.usersRepository.save(user);
  }
}
