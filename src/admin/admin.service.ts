// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin)
    private readonly adminRepository: typeof Admin,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    const admin = new Admin();
    admin.username = createAdminDto.username;
    admin.password = createAdminDto.password;
    return admin.save();
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.findAll<Admin>();
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findByPk<Admin>(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  async updateAdmin(id: number, updateAdminDto: UpdateAdminDto): Promise<[number, Admin[]]> {
    const [numberOfAffectedRows, [updatedAdmin]] = await this.adminRepository.update({ ...updateAdminDto }, { where: { id }, returning: true });
    if (!numberOfAffectedRows) {
      throw new NotFoundException('Admin not found');
    }
    return [numberOfAffectedRows, [updatedAdmin]];
  }

  async deleteAdmin(id: number): Promise<void> {
    const admin = await this.findOne(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    await admin.destroy();
  }
}
