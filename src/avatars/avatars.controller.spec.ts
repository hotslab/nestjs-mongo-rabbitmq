import { Test, TestingModule } from '@nestjs/testing';
import { AvatarsController } from './avatars.controller';
import { AvatarsService } from './avatars.service';
import { readFileSync } from 'node:fs';
import { UserType } from '../users/dto/user';
import { RmqContext } from '@nestjs/microservices';
import { Avatar } from './schemas/avatar.schema';
import { Document, Types } from 'mongoose';

describe('Users Controller', () => {
  let controller: AvatarsController;
  let service: AvatarsService;
  let rabbitContext: RmqContext;

  const image = readFileSync(process.cwd() + '/test/images/TestAvatar.jpg');
  const buffer = Buffer.from(image);

  const avatarImage: Express.Multer.File = {
    fieldname: 'avatar',
    originalname: 'TestAvatar.jpg',
    encoding: '7bit',
    mimetype: 'image/jpg',
    buffer: buffer,
  } as Express.Multer.File;

  const userData: UserType = {
    _id: '66014def6b542795fe3b00ab',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@email.com',
    password: 'secret',
  };

  const avatarData: Avatar = {
    userId: new Types.ObjectId('66014def6b542795fe3b00ab'),
    hash: 'data:image/jpg;base64,4werwrrref3f3wfsdjvlkdfvna.....',
    file: './images/TestAvatar.jpg',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvatarsController],
      providers: [
        {
          provide: AvatarsService,
          useValue: {
            create: jest.fn().mockResolvedValue(null),
            findOne: jest.fn().mockResolvedValue(null),
            delete: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: RmqContext,
          useValue: {
            getChannelRef: () => {
              return {
                ack: () => jest.fn().mockResolvedValue(null),
              };
            },
            getMessage: jest.fn().mockResolvedValue(() => {
              message: 'channel message sent';
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AvatarsController>(AvatarsController);
    service = module.get<AvatarsService>(AvatarsService);
    rabbitContext = module.get<RmqContext>(RmqContext);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createAvatar()', () => {
    it('should create a new avatar', async () => {
      const createSpy = jest.spyOn(service, 'create');
      await controller.createAvatar(
        { user: userData, avatar: avatarImage },
        rabbitContext,
      );
      expect(createSpy).toHaveBeenCalledWith({
        user: userData,
        avatar: avatarImage,
      });
    });
  });

  describe('findOne()', () => {
    it('should return the user avatar', async () => {
      const createSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(avatarData);
      expect(controller.findOne('66014def6b542795fe3b00ab')).resolves.toEqual(
        avatarData,
      );
      expect(createSpy).toHaveBeenCalledWith('66014def6b542795fe3b00ab');
      expect(service.findOne).toHaveBeenCalled();
    });
  });

  describe('delete()', () => {
    it('should delete the user avatar', async () => {
      const createSpy = jest.spyOn(service, 'delete').mockResolvedValueOnce(
        avatarData as Document<unknown, object, Avatar> &
          Avatar & {
            _id: Types.ObjectId;
          },
      );
      expect(controller.delete('66014def6b542795fe3b00ab')).resolves.toEqual(
        avatarData,
      );
      expect(createSpy).toHaveBeenCalledWith('66014def6b542795fe3b00ab');
      expect(service.delete).toHaveBeenCalled();
    });
  });
});
