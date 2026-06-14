import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from '../common/dto';
import { toJson } from '../common/utils/json.util';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(visibleOnly = false) {
    return this.prisma.review.findMany({
      where: visibleOnly ? { isVisible: true } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findById(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async create(dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        authorName: dto.authorName,
        authorPhoto: dto.authorPhoto,
        rating: dto.rating ?? 5,
        text: toJson(dto.text)!,
        source: dto.source || 'MANUAL',
        googleReviewId: dto.googleReviewId,
        isVisible: dto.isVisible ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(id: string, dto: Partial<CreateReviewDto>) {
    await this.findById(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.text) data.text = toJson(dto.text);
    return this.prisma.review.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.review.delete({ where: { id } });
    return { message: 'Review deleted' };
  }
}
