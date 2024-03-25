import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AvatarsModule } from './avatars/avatars.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:27017/${process.env.MONGO_DB}`,
    ),
    UsersModule,
    AvatarsModule,
  ],
})
export class AppModule {}
