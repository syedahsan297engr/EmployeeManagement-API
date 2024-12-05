import { DataSource } from 'typeorm';
import { EmployeeSeeder } from './seeders/employee.seeder';
import { UserSeeder } from './seeders/user.seeder';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

async function runSeeder() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  console.log('Running seeders...');
  await new EmployeeSeeder().run(dataSource);
  await new UserSeeder().run(dataSource);

  console.log('Seeding completed');
  await dataSource.destroy();
}
runSeeder();
