import { Controller, Delete, Get, Param } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { Avatar } from './schemas/avatar.schema';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserType } from 'src/users/dto/user';

@Controller('api/users')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @MessagePattern('create-avatar')
  async createAvatar(
    @Payload()
    { user, avatar }: { user: UserType; avatar: Express.Multer.File },
    @Ctx() context: RmqContext,
  ) {
    try {
      await this.avatarsService.create({ user: user, avatar: avatar });
    } catch (error) {
      console.log('AVATAR ERROR', error);
    }
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  @Get('/:id/avatar')
  async findOne(@Param('id') id: string): Promise<Avatar> {
    return await this.avatarsService.findOne(id);
  }

  @Delete('/:id/avatar')
  async delete(@Param('id') id: string) {
    return await this.avatarsService.delete(id);
  }
}
