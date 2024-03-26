import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
// import { UsersService } from './users.service';
import { Avatar } from './schemas/avatar.schema';
import { AvatarsService } from './avatars.service';
import { readFileSync, unlink } from 'node:fs';
import { UserType } from '../users/dto/user';

// jest.mock('unlink', () =>
//   jest.fn().mockImplementationOnce((filename, callback) => {
//     callback(null);
//   }),
// );

jest.mock('node:fs', () => {
  const originalModule = jest.requireActual('node:fs');
  return {
    __esModule: true,
    ...originalModule,
    unlink: jest.fn().mockImplementationOnce((filename, callback) => {
      callback(null);
    }),
  };
});

describe('UsersService', () => {
  let service: AvatarsService;
  let model: Model<Avatar>;

  const image = readFileSync(process.cwd() + '/test/images/TestAvatar.jpg');
  const buffer = Buffer.from(image);

  const avatarImage: Express.Multer.File = {
    fieldname: 'avatar',
    originalname: 'TestAvatar.jpg',
    encoding: '7bit',
    mimetype: 'image/jpg',
    buffer: buffer,
    path: process.cwd() + '/test/images/TestAvatar.jpg',
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
      providers: [
        AvatarsService,
        {
          provide: getModelToken('Avatar'),
          useValue: {
            findOne: jest.fn().mockResolvedValue(avatarData),
            create: jest.fn().mockResolvedValue(avatarData),
            exec: jest.fn().mockResolvedValue(avatarData),
            findOneAndDelete: jest.fn().mockResolvedValue(avatarData),
          },
        },
        {
          provide: unlink,
          useValue: () => {},
        },
      ],
    }).compile();

    service = module.get<AvatarsService>(AvatarsService);
    model = module.get<Model<Avatar>>(getModelToken('Avatar'));
    // const unlinkDelete = unlink;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert a new avatar', async () => {
    const modelCreateSpy = jest.spyOn(model, 'create');
    const newAvatar = await service.create({
      user: userData,
      avatar: avatarImage,
    });
    expect(modelCreateSpy).toHaveBeenCalled();
    expect(newAvatar).toEqual(avatarData);
  });

  it('should return selected user avatar', async () => {
    const modelFindOneSpy = jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(avatarData),
    } as any);
    const avatar = await service.findOne(userData._id);
    expect(avatar).toEqual(avatarData);
    expect(modelFindOneSpy).toHaveBeenCalledWith({ userId: userData._id });
  });

  it('should delete selected user avatar', async () => {
    const modelFindOneSpy = jest
      .spyOn(model, 'findOneAndDelete')
      .mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(avatarData),
      } as any);
    const avatar = await service.delete(userData._id);
    expect(avatar).toEqual(avatarData);
    expect(modelFindOneSpy).toHaveBeenCalledWith({ userId: userData._id });
    expect(unlink).toHaveBeenCalledWith(avatar.file, expect.any(Function));
  });
});
