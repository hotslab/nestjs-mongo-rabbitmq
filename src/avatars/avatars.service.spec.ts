// import { getModelToken } from '@nestjs/mongoose';
// import { Test, TestingModule } from '@nestjs/testing';
// import { Model } from 'mongoose';
// import { UsersService } from './users.service';
// import { User } from './schemas/avatar.schema';

// const mockUser = {
//   firstName: 'John',
//   lastName: 'Doe',
//   email: 'john@email.com',
//   password: 'secret',
//   _id: 'a id',
// };

// describe('UsersService', () => {
//   let service: UsersService;
//   let model: Model<User>;

//   const usersArray = [
//     {
//       firstName: 'John',
//       lastName: 'Doe',
//       email: 'john@email.com',
//       password: 'secret',
//     },
//     {
//       firstName: 'Jane',
//       lastName: 'Smith',
//       email: 'jane@email.com',
//       password: 'secret',
//     },
//     {
//       firstName: 'Hans',
//       lastName: 'Kruger',
//       email: 'hans@email.com',
//       password: 'secret',
//     },
//   ];

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         {
//           provide: getModelToken('User'),
//           useValue: {
//             new: jest.fn().mockResolvedValue(mockUser),
//             constructor: jest.fn().mockResolvedValue(mockUser),
//             find: jest.fn(),
//             create: jest.fn(),
//             exec: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//     model = module.get<Model<User>>(getModelToken('User'));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it('should return all user', async () => {
//     jest.spyOn(model, 'find').mockReturnValue({
//       exec: jest.fn().mockResolvedValueOnce(usersArray),
//     } as any);
//     const users = await service.findAll();
//     expect(users).toEqual(usersArray);
//   });

//   it('should insert a new user', async () => {
//     jest.spyOn(model, 'create').mockImplementationOnce(() =>
//       Promise.resolve({
//         firstName: 'John',
//         lastName: 'Doe',
//         email: 'john@email.com',
//         password: 'secret',
//       } as any),
//     );
//     const newUser = await service.create({
//       firstName: 'John',
//       lastName: 'Doe',
//       email: 'john@email.com',
//       password: 'secret',
//     });
//     expect(newUser).toEqual(mockUser);
//   });
// });
