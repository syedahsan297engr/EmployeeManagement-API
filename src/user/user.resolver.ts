import { UserService } from './user.service';
import { User } from './entities/user.entity'; // Assume you have a User entity defined
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { LoggedInUserId } from 'src/common/LoggedInUserId.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async currentUser(@LoggedInUserId() userId: number) {
    return await this.userService.getCurrentUser(userId);
  }

  @Query(() => User)
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return await this.userService.findOne(id);
  }
}
