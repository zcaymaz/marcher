import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      menuCount,
      blogCount,
      campaignCount,
      franchiseNew,
      reviewCount,
      referenceCount,
    ] = await Promise.all([
      this.prisma.menuItem.count(),
      this.prisma.blogPost.count(),
      this.prisma.campaign.count({ where: { isActive: true } }),
      this.prisma.franchiseInquiry.count({ where: { status: 'NEW' } }),
      this.prisma.review.count({ where: { isVisible: true } }),
      this.prisma.reference.count(),
    ]);

    return {
      menuCount,
      blogCount,
      campaignCount,
      franchiseNew,
      reviewCount,
      referenceCount,
    };
  }
}
