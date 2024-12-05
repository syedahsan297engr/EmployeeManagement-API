import { DataSource } from 'typeorm';
import { Employee } from 'src/employee/employee.entity';

export class EmployeeSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const employeeRepository = dataSource.getRepository(Employee);

    const employees = Array.from({ length: 15 }).map((_, index) => ({
      name: `Employee ${index + 1}`,
      age: 25 + index,
      class: `Class ${(index % 3) + 1}`,
      subjects: ['Math', 'Science', 'History'].slice(0, (index % 3) + 1),
      attendance: Math.floor(Math.random() * 100),
    }));

    await employeeRepository.save(employees);
    console.log('Employee seeding completed');
  }
}
