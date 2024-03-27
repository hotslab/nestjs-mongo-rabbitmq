import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserType } from './dto/user';
import { User } from './schemas/user.schema';
import { ClientProxy } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject('RMQ_SERVICE') private readonly queueClient: ClientProxy,
    private readonly httpService: HttpService,
  ) {
    this.queueClient.connect();
  }

  async create(
    userData: UserType,
    avatar: Express.Multer.File,
  ): Promise<{ user: User; originalname: string; filename: string }> {
    const exists = await this.userModel
      .findOne({ email: userData.email })
      .exec();
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

  async findOne(id: string): Promise<unknown> {
    try {
      const user = await this.userModel
        .findOne({ _id: new Types.ObjectId(id) })
        .exec();
      if (user) return user;
      const randomId = Math.floor(Math.random() * 13);
      const response = await firstValueFrom(
        this.httpService.get(`https://reqres.in/api/users/${randomId}`),
      );
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
}
