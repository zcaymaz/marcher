import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from '../common/dto';
import { CampaignPlacement } from '@prisma/client';
import { toJson } from '../common/utils/json.util';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.campaign.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findActive(placement?: CampaignPlacement) {
    const now = new Date();
    return this.prisma.campaign.findMany({
      where: {
        isActive: true,
        ...(placement ? { placement } : {}),
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findById(id: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async create(dto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        title: toJson(dto.title)!,
        subtitle: toJson(dto.subtitle),
        ctaText: toJson(dto.ctaText),
        ctaLink: dto.ctaLink,
        image: dto.image,
        isActive: dto.isActive ?? true,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        sortOrder: dto.sortOrder ?? 0,
        placement: (dto.placement as CampaignPlacement) || 'HOME_HERO',
      },
    });
  }

  async update(id: string, dto: Partial<CreateCampaignDto>) {
    await this.findById(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    return this.prisma.campaign.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.campaign.delete({ where: { id } });
    return { message: 'Campaign deleted' };
  }
}
