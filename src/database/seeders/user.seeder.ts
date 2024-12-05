import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt'; // To hash passwords
import { User } from 'src/user/entities/user.entity';

export class UserSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const users = [
      {
        name: 'Admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('pass123', 10),
        RoleId: 2, // Admin Role
      },
      {
        name: 'Regular',
        email: 'user@example.com',
        password: await bcrypt.hash('password123', 10),
        RoleId: 1, // Regular Role
      },
      {
        name: 'ahsan',
        email: 'ahsan@gmail.com',
        password: await bcrypt.hash('pass123', 10),
        RoleId: 2, // Admin Role
      },
    ];

    await userRepository.save(users);
    console.log('User seeding completed');
  }
}
