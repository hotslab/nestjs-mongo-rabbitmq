import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Avatar } from './schemas/avatar.schema';
import { readFileSync, unlink } from 'node:fs';
import { UserType } from '../users/dto/user';

@Injectable()
export class AvatarsService {
  constructor(
    @InjectModel(Avatar.name) private readonly avatarModel: Model<Avatar>,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(AvatarsService.name);
  }

  async create({
    user,
    avatar,
  }: {
    user: UserType;
    avatar: Express.Multer.File;
  }): Promise<unknown> {
    const buffer = readFileSync(avatar.path);
    const base64String = Buffer.from(buffer).toString('base64');
    const final = `data:${avatar.mimetype};base64,${base64String}`;
    const avatarData = {
      userId: user._id,
      hash: final,
      file: avatar.path as string,
    };
    const newAvatar = await this.avatarModel.create(avatarData);
    return newAvatar;
  }

  async findOne(id: string): Promise<Avatar | null> {
    try {
      return await this.avatarModel.findOne({ userId: id }).exec();
    } catch (error) {
      return error.message;
    }
  }

  async delete(id: string) {
    const deletedAvatar = await this.avatarModel
      .findOneAndDelete({ userId: id })
      .exec();
    if (deletedAvatar)
      unlink(deletedAvatar.file, (err) => {
        if (err) throw err;
        this.logger.log(`successfully deleted ${deletedAvatar.file}`);
      });
    return deletedAvatar;
  }
}
