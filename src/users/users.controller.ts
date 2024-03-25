import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserType } from './dto/user';
import { User } from './schemas/user.schema';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async create(
    @Body() userData: UserType,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    avatar: Express.Multer.File,
  ): Promise<{ user: User; originalname: string; filename: string }> {
    return await this.usersService.create(userData, avatar);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Delete(':id/all')
  async deleteAll() {
    return this.usersService.deleteAll();
  }

  @MessagePattern('send-new-user-email')
  sendNewUSerEmail(@Payload() data: unknown, @Ctx() context: RmqContext) {
    console.log('USER DATA', data);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
