import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Avatar, AvatarSchema } from 'src/avatars/schemas/avatar.schema';
import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from '../emails/email.service';

@Module({
  imports: [
    HttpModule,
    ClientsModule.registerAsync([
      {
        name: 'RMQ_SERVICE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'main_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
    MongooseModule.forFeature([{ name: Avatar.name, schema: AvatarSchema }]),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function (next) {
            if (this.isModified('password')) {
              bcrypt.genSalt(
                Number.parseInt(process.env.SALT_WORK_FACTOR),
                (error, salt) => {
                  if (error) return next(error);
                  bcrypt.hash(this.password, salt, (err, hash) => {
                    if (err) return next(err);
                    this.password = hash;
                    next();
                  });
                },
              );
            }
          });
          return schema;
        },
      },
    ]),
    MulterModule.register({
      dest: './images',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
})
export class UsersModule {}
