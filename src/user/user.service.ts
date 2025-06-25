import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(dto: CreateUserDto) {
    return this.userRepository.create(dto.name, dto.email);
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: number) {
    return this.userRepository.findOne(id);
  }

  update(id: number, dto: UpdateUserDto) {
    return this.userRepository.update(id, dto.name!, dto.email!);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
