import { ObjectType, Field, Int } from '@nestjs/graphql'; // Import GraphQL decorators
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'Employee' })
export class Employee {
  @Field(() => Int) // Expose id as an integer
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Field(() => Int)
  @Column({ type: 'int', nullable: false })
  age: number;

  @Field()
  @Column({ type: 'varchar', length: 20, nullable: false })
  class: string;

  @Field(() => [String])
  @Column({ type: 'text', array: true, nullable: false })
  subjects: string[];

  @Field(() => Int)
  @Column({ type: 'int', nullable: false })
  attendance: number;
}
