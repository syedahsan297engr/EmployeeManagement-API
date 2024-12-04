import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Public } from 'src/common/public.decorator';
import { SetAuthTokenInterceptor } from 'src/common/set-auth-token.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { LoginResponse } from './dto/login-response.dto';
import { Message } from '../common/message.dto';

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
  @UseInterceptors(SetAuthTokenInterceptor) // Apply the interceptor for cookie setting
  async login(@Args('loginDto') loginDto: LoginDto): Promise<LoginResponse> {
    const token = await this.authService.login(loginDto);
    return { message: 'Login successful' }; // Return token for interceptor to process
  }
}
