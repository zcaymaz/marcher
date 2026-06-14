import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateFranchiseInquiryDto,
  UpdateFranchiseStatusDto,
} from '../common/dto';

@Injectable()
export class FranchiseService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.franchiseInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const inquiry = await this.prisma.franchiseInquiry.findUnique({
      where: { id },
    });
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }

  async create(dto: CreateFranchiseInquiryDto) {
    if (dto.website) {
      throw new BadRequestException('Spam detected');
    }
    return this.prisma.franchiseInquiry.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        city: dto.city,
        message: dto.message,
      },
    });
  }

  async updateStatus(id: string, dto: UpdateFranchiseStatusDto) {
    await this.findById(id);
    return this.prisma.franchiseInquiry.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.franchiseInquiry.delete({ where: { id } });
    return { message: 'Inquiry deleted' };
  }
}
