import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    // Check if roles already exist
    const userRole = await this.roleRepository.findOne({
      where: { name: 'user' },
    });
    const adminRole = await this.roleRepository.findOne({
      where: { name: 'admin' },
    });

    if (!userRole) {
      await this.roleRepository.save({ name: 'user' });
    }

    if (!adminRole) {
      await this.roleRepository.save({ name: 'admin' });
    }
  }

  async findRoleById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }
}
