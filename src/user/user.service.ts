import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Role as RoleEnum } from './dto/role.enum';
import { Request as ExpressRequest } from 'express';
import { Repository } from 'typeorm';
import { PasswordHelper } from './password.helper';
import { JwtService } from 'src/utils/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordHelper: PasswordHelper,
    private readonly jwtService: JwtService,
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // get logged in user
  async getCurrentUser(id: number): Promise<User> {
    return await this.findOne(id);
  }

  async signup(signupDto: SignupDto): Promise<string> {
    const existingUser = await this.userRepository.findOneBy({
      email: signupDto.email,
    });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const user = this.userRepository.create({
      ...signupDto,
    });

    await this.userRepository.save(user);
    return 'sign up successful';
  }

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'name', 'email', 'password', 'role'],
      relations: ['role'],
    });

    if (
      !user ||
      !(await this.passwordHelper.validatePassword(
        loginDto.password,
        user.password,
      ))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const role: RoleEnum = user.role.name as RoleEnum;
    const token = this.jwtService.generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: role,
    });

    // Return the token without setting the cookie
    return token;
  }

  validateToken(req: ExpressRequest) {
    const token = req.cookies['auth_token']; // Get the token from the cookie

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = this.jwtService.verifyToken(token); // Verify the token
      return decoded; // Return the decoded token if valid
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
