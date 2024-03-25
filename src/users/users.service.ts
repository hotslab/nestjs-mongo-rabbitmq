import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserType } from './dto/user';
import { User } from './schemas/user.schema';
import { Avatar } from 'src/avatars/schemas/avatar.schema';
import { ClientProxy } from '@nestjs/microservices';
import { unlink } from 'node:fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Avatar.name) private readonly avatarModel: Model<Avatar>,
    @Inject('RMQ_SERVICE') private readonly queueClient: ClientProxy,
  ) {
    this.queueClient.connect();
  }

  async create(
    userData: UserType,
    avatar: Express.Multer.File,
  ): Promise<{ user: User; originalname: string; filename: string }> {
    const exists = await this.userModel.findOne({ email: userData.email });
    if (exists) {
      throw new HttpException(
        `User with email ${userData.email} already exists!`,
        HttpStatus.CONFLICT,
      );
    } else {
      const user = await this.userModel.create(userData);
      this.queueClient.send('send-new-user-email', { user: user }).subscribe();
      this.queueClient
        .send('create-avatar', { user: user, avatar: avatar })
        .subscribe();
      const response = {
        user: user,
        originalname: avatar.originalname,
        filename: avatar.filename,
      };
      return response;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: new Types.ObjectId(id) }).exec();
  }

  async delete(id: string) {
    const deletedAvatar = await this.avatarModel
      .findOneAndDelete({ userId: new Types.ObjectId(id) })
      .exec();
    unlink(deletedAvatar.file, (err) => {
      if (err) throw err;
      console.log(`successfully deleted ${deletedAvatar.file}`);
    });
    const deletedUser = await this.userModel
      .findByIdAndDelete({ _id: new Types.ObjectId(id) })
      .exec();
    return deletedUser;
  }

  async deleteAll() {
    await this.avatarModel.deleteMany().exec();
    await this.userModel.deleteMany().exec();
  }
}
