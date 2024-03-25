import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AvatarType } from './dto/avatar';
import { Avatar } from './schemas/avatar.schema';
import { readFileSync, unlink } from 'node:fs';
import { UserType } from 'src/users/dto/user';

@Injectable()
export class AvatarsService {
  constructor(
    @InjectModel(Avatar.name) private readonly avatarModel: Model<Avatar>,
  ) {}

  async create({
    user,
    avatar,
  }: {
    user: UserType;
    avatar: Record<string, string | number>;
  }): Promise<unknown> {
    const buffer = readFileSync(avatar.path);
    const base64String = Buffer.from(buffer).toString('base64');
    const final = `data:${avatar.mimetype};base64,${base64String}`;
    console.log(final, buffer);
    const avatarData: AvatarType = {
      userId: user._id,
      hash: final,
      file: avatar.path as string,
    };
    const newAvatar = await this.avatarModel.create(avatarData);
    return newAvatar;
  }

  async findOne(id: string): Promise<Avatar> {
    return await this.avatarModel.findOne({ userId: id }).exec();
  }

  async delete(id: string) {
    const deletedAvatar = await this.avatarModel
      .findOneAndDelete({ userId: new Types.ObjectId(id) })
      .exec();
    unlink(deletedAvatar.file, (err) => {
      if (err) throw err;
      console.log(`successfully deleted ${deletedAvatar.file}`);
    });
    return deletedAvatar;
  }
}
