import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';

const BCRYPT_SALT = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(email: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ email });
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    const isUserExists = await this.findOne(data.email);

    if (isUserExists)
      throw new BadRequestException(
        'A user with this email is already registered',
      );

    return this.createUser(data);
  }

  async createDefaultAdminUser(data: CreateUserDto): Promise<UserEntity> {
    return this.createUser(data, true);
  }

  // Create a user in database
  async createUser(data: CreateUserDto, isAdmin = false): Promise<UserEntity> {
    const user = new UserEntity();

    user.email = data.email;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.password = await bcrypt.hash(data.password, BCRYPT_SALT);
    user.isAdmin = isAdmin;
    user.createdAt = new Date();

    return this.usersRepository.save(user);
  }
}
