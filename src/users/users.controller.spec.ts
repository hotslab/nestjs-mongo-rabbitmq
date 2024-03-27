import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserType } from './dto/user';
import { UsersService } from './users.service';
import { readFileSync } from 'node:fs';
import { EmailService } from '../emails/email.service';
import { RmqContext } from '@nestjs/microservices';

describe('Users Controller', () => {
  let controller: UsersController;
  let service: UsersService;
  let rabbitContext: RmqContext;
  let emailService: EmailService;

  const image = readFileSync(process.cwd() + '/test/images/TestAvatar.jpg');
  const buffer = Buffer.from(image);

  const avatarImage = {
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

  const createResponse = {
    user: userData,
    originalname: 'TestAvatar.jpg',
    filename: 'TestAvatar.jpg',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(createResponse),
            findOne: jest.fn().mockResolvedValue(userData),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn().mockResolvedValue('completed'),
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

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    rabbitContext = module.get<RmqContext>(RmqContext);
    emailService = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create()', () => {
    it('should create a new user', async () => {
      const createUserServiceSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(createResponse);
      await controller.create(userData, avatarImage);
      expect(createUserServiceSpy).toHaveBeenCalledWith(userData, avatarImage);
    });
  });

  describe('findOne()', () => {
    it('should return a user', async () => {
      const createSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(userData);
      expect(controller.findOne('66014def6b542795fe3b00ab')).resolves.toEqual(
        userData,
      );
      expect(createSpy).toHaveBeenCalledWith('66014def6b542795fe3b00ab');
      expect(service.findOne).toHaveBeenCalled();
    });
  });

  describe('sendNewUSerEmail()', () => {
    it('should send an email to user', async () => {
      const createSpy = jest.spyOn(emailService, 'sendEmail');
      controller.sendNewUSerEmail({ user: userData }, rabbitContext);
      expect(createSpy).toHaveBeenCalledWith({ user: userData });
    });
  });
});
