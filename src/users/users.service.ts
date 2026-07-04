import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../repo/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../common/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
  ) {}

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.userRepository.exists({ email: updateUserDto.email });
      if (emailExists) {
        throw new BadRequestException('Email already in use');
      }
    }

    const updatedUser = await this.userRepository.updateById(userId, updateUserDto);
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword;
  }

  async deactivateUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.updateById(userId, { isActive: false });
    await this.emailService.sendAccountDeactivationEmail(user.email, user.username);
  }

  async deleteUserById(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete or permanent delete based on your requirements
    await this.userRepository.updateById(userId, { isActive: false });
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }
}
