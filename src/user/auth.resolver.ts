import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';
import { Message } from '../common/message.dto';
import { Public } from 'src/common/public.decorator';
import { LoginResponse } from './dto/login-response.dto';
import { Resolver, Mutation, Args } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: UserService) {}

  @Public()
  @Mutation(() => Message) // signup returns a string message
  async signup(@Args('signupDto') signupDto: SignupDto): Promise<Message> {
    const message = await this.authService.signup(signupDto);
    return { message: message };
  }

  @Public()
  @Mutation(() => LoginResponse) // login returns a string message
  async login(@Args('loginDto') loginDto: LoginDto): Promise<LoginResponse> {
    const token = await this.authService.login(loginDto);
    return { token: token }; // Return token for interceptor to process
  }
}
