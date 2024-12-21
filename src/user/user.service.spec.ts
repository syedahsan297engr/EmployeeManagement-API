import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PasswordHelper } from './password.helper';
import { JwtService } from 'src/utils/jwt.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let passwordHelper: PasswordHelper;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: PasswordHelper,
          useValue: {
            validatePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            generateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    passwordHelper = module.get<PasswordHelper>(PasswordHelper);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await userService.findOne(1);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(userService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user', async () => {
      const user = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      } as User;
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);

      const result = await userService.getCurrentUser(1);

      expect(result).toEqual(user);
    });
  });

  describe('signup', () => {
    it('should create a new user and return a success message', async () => {
      const signupDto: SignupDto = {
        name: 'test',
        email: 'test@example.com',
        password: 'password',
      };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockReturnValue(signupDto as User);
      jest.spyOn(userRepository, 'save').mockResolvedValue(signupDto as User);

      const result = await userService.signup(signupDto);

      expect(result).toBe('sign up successful');
    });

    it('should throw UnauthorizedException if user already exists', async () => {
      const signupDto: SignupDto = {
        name: 'test',
        email: 'test@example.com',
        password: 'password',
      };
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(signupDto as User);

      await expect(userService.signup(signupDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should return a JWT token for valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: { name: 'admin' },
      } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(passwordHelper, 'validatePassword').mockResolvedValue(true);
      jest.spyOn(jwtService, 'generateToken').mockReturnValue('test-jwt-token');

      const result = await userService.login(loginDto);

      expect(result).toBe('test-jwt-token');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };
      const user = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: { name: 'admin' },
      } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(passwordHelper, 'validatePassword').mockResolvedValue(false);

      await expect(userService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(userService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
