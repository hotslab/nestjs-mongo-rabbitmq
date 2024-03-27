import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { readFileSync } from 'node:fs';
import { ClientProxy } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { UserType } from './dto/user';
import { Observable } from 'rxjs';

const image = readFileSync(process.cwd() + '/test/images/TestAvatar.jpg');
const buffer = Buffer.from(image);

const avatarImage = {
  fieldname: 'avatar',
  originalname: 'TestAvatar.jpg',
  filename: 'TestAvatar.jpg',
  encoding: '7bit',
  mimetype: 'image/jpg',
  buffer: buffer,
} as Express.Multer.File;

const mockUser: UserType = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@email.com',
  password: 'secret',
  _id: '66014def6b542795fe3b00ab',
};

const createResponse = {
  user: mockUser,
  originalname: 'TestAvatar.jpg',
  filename: 'TestAvatar.jpg',
};

describe('UsersService', () => {
  let queueClient: ClientProxy;
  let service: UsersService;
  let model: Model<User>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: HttpService,
          useValue: {
            get: () =>
              new Observable((subscriber) => {
                subscriber.next({ data: mockUser });
                subscriber.complete();
              }),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            findOne: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: 'RMQ_SERVICE',
          useValue: {
            connect: jest.fn().mockResolvedValue({
              send: new Observable((subscriber) => {
                subscriber.next('sent');
                subscriber.complete();
              }),
            }),
            send: () =>
              new Observable((subscriber) => {
                subscriber.next('sent');
                subscriber.complete();
              }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken('User'));
    queueClient = module.get<ClientProxy>('RMQ_SERVICE');
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert a new user', async () => {
    const queueClientSpy = jest.spyOn(queueClient, 'send');
    const modelFindOneSpy = jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(null),
    } as any);
    const response = await service.create(mockUser, avatarImage);
    expect(modelFindOneSpy).toHaveBeenCalled();
    expect(response).toEqual(createResponse);
    expect(queueClientSpy).toHaveBeenCalledWith('send-new-user-email', {
      user: mockUser,
    });
    expect(queueClientSpy).toHaveBeenCalledWith('create-avatar', {
      user: mockUser,
      avatar: avatarImage,
    });
  });

  it('should return user from db if present', async () => {
    const modelFindOneSpy = jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    } as any);
    const user = await service.findOne(mockUser._id);
    expect(modelFindOneSpy).toHaveBeenCalledWith({
      _id: new Types.ObjectId(mockUser._id),
    });
    expect(user).toEqual(mockUser);
  });

  it('should return random user from external api when user not found in db', async () => {
    const modelFindOneSpy = jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(null),
    } as any);
    const httpServiceSpy = jest.spyOn(httpService, 'get');
    const user = await service.findOne(mockUser._id);
    expect(modelFindOneSpy).toHaveBeenCalledWith({
      _id: new Types.ObjectId(mockUser._id),
    });
    expect(httpServiceSpy).toHaveBeenCalled();
    expect(user).toEqual(mockUser);
  });
});
