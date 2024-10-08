import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from '../../model/user.model';
import { CreateUserInput } from '../../dto/user.input';
import { User } from '../../interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from '../../dto/update-user.input';
import { UserRolesShared } from '../../shared/user-roles.shared';

const TAG = 'UserService';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserModel>,
  ) {}

  async showAll(): Promise<UserModel[]> {
    return await this.userModel.find();
  }

  async getUser(email: string): Promise<UserModel> {
    return await this.userModel.findOne({
      email,
    });
  }

  async create(userDTO: User): Promise<UserModel> {
    const email = userDTO.email;
    const user = await this.userModel.findOne({ email: email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUser = new this.userModel(userDTO);
    return await createdUser.save();
  }

  async findByLogin(userDTO: CreateUserInput) {
    const { email, password } = userDTO;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    if (await bcrypt.compare(password, user.password)) {
      return user;
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async update(id: string, newUser: UpdateUserInput, role: UserRolesShared) {
    const user: User = await this.userModel.findOne({ _id: id });
    const userWithEmail = await this.userModel.findOne({
      email: newUser.email,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user === undefined || user === null) {
      throw new HttpException(`User doesn't exists`, HttpStatus.BAD_REQUEST);
    } else if (
      userWithEmail !== null &&
      userWithEmail !== undefined &&
      newUser.email !== user.email
    ) {
      throw new HttpException('Email is already used', HttpStatus.BAD_REQUEST);
    }

    if (
      role == UserRolesShared.NORMAL &&
      newUser.userRole != user.userRole &&
      newUser.userRole != null
    ) {
      throw new ForbiddenException("Normal users can't change roles");
    }

    let userRole: UserRolesShared;
    if (role === UserRolesShared.ADMIN) {
      userRole = newUser.userRole;
    } else if (role === undefined || role === null) {
      userRole = user.userRole;
    } else {
      userRole = role;
    }

    const updateUser: CreateUserInput = {
      email: newUser.email || user.email,
      password: newUser.password || user.password,
      userRole: userRole,
    };

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      { ...updateUser },
      { new: true },
    );

    return updatedUser;
  }

  async findByPayload(payload: any) {
    const email = payload.email;
    return await this.userModel.findOne({ email });
  }

  async delete(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return await this.userModel.findByIdAndDelete(id);
  }

  async setPassword(email: string, newPassword: string): Promise<boolean> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      await user.save();
      return true;
    } catch (e) {
      console.log(TAG, e);
      throw new HttpException(
        'Error setting password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkPassword(email: string, password: string) {
    const userFromDb = await this.userModel.findOne({ email: email });
    if (!userFromDb)
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    return await bcrypt.compare(password, userFromDb.password);
  }
}
