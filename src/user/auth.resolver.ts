import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Public } from 'src/common/public.decorator';
import { LoginResponse } from './dto/login-response.dto';
import { Message } from '../common/message.dto';
import { Request } from 'express';

interface GraphQLRequestContext {
  req: Request;
}

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
    console.log(token);
    return { token: token }; // Return token for interceptor to process
  }

  @Query(() => Message) // Assuming protected route check returns a string message
  async checkAuth(@Context() context: GraphQLRequestContext): Promise<Message> {
    const request: Request = context.req; // Access the request object from the context
    console.log('request is: ', request);
    try {
      const user = this.authService.validateToken(request); // Validate the token
      return { message: 'Access granted' }; // Send back user info
    } catch (error) {
      throw new Error(error.message); // Throw error to be caught by GraphQL
    }
  }
}
