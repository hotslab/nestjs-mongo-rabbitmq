// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from './users.controller';
// import { UserType } from './types';
// import { UsersService } from './users.service';

// describe('Users Controller', () => {
//   let controller: UsersController;
//   let service: UsersService;
//   const userData: UserType = {
//     firstName: 'John',
//     lastName: 'Doe',
//     email: 'john@email.com',
//     password: 'secret',
//   };

//   const mockUser = {
//     firstName: 'John',
//     lastName: 'Doe',
//     email: 'john@email.com',
//     password: 'secret',
//     _id: 'a id',
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//       providers: [
//         {
//           provide: UsersService,
//           useValue: {
//             findAll: jest.fn().mockResolvedValue([
//               {
//                 firstName: 'John',
//                 lastName: 'Doe',
//                 email: 'john@email.com',
//                 password: 'secret',
//               },
//               {
//                 firstName: 'Jane',
//                 lastName: 'Smith',
//                 email: 'jane@email.com',
//                 password: 'secret',
//               },
//               {
//                 firstName: 'Hans',
//                 lastName: 'Kruger',
//                 email: 'hans@email.com',
//                 password: 'secret',
//               },
//             ]),
//             create: jest.fn().mockResolvedValue(userData),
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<UsersController>(UsersController);
//     service = module.get<UsersService>(UsersService);
//   });

//   describe('create()', () => {
//     it('should create a new user', async () => {
//       const createSpy = jest
//         .spyOn(service, 'create')
//         .mockResolvedValueOnce(mockUser);

//       await controller.create(userData);
//       expect(createSpy).toHaveBeenCalledWith(userData);
//     });
//   });

//   describe('findAll()', () => {
//     it('should return an array of users', async () => {
//       expect(controller.findAll()).resolves.toEqual([
//         {
//           firstName: 'John',
//           lastName: 'Doe',
//           email: 'john@email.com',
//           password: 'secret',
//         },
//         {
//           firstName: 'Jane',
//           lastName: 'Smith',
//           email: 'jane@email.com',
//           password: 'secret',
//         },
//         {
//           firstName: 'Hans',
//           lastName: 'Kruger',
//           email: 'hans@email.com',
//           password: 'secret',
//         },
//       ]);
//       expect(service.findAll).toHaveBeenCalled();
//     });
//   });
// });
