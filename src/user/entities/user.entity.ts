import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql'; // Import GraphQL decorators

import { Role } from './role.entity';

@ObjectType() // Mark this as a GraphQL ObjectType
@Entity({ name: 'Users' }) // Specify table name if needed
export class User {
  @Field(() => Int) // Expose id as an integer
  @PrimaryGeneratedColumn()
  id: number;

  @Field() // Expose name as a field in GraphQL
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Field() // Expose email as a field in GraphQL
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false, select: false }) // Exclude password by default
  password: string;

  @Field(() => Int) // Expose RoleId as an integer in GraphQL
  @Column({ type: 'int', nullable: false, default: 1 })
  RoleId: number;

  @Field(() => Role) // Expose role as a field in GraphQL
  @ManyToOne(() => Role, { eager: true }) // Establish relationship with Role
  @JoinColumn({ name: 'RoleId' }) // Links to role table
  role: Role;
}
