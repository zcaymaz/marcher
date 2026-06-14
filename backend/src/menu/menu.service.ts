import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from '../common/dto';
import { generateSlug, getNameForSlug } from '../common/utils/slug.util';
import { toJson } from '../common/utils/json.util';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async findAll(availableOnly = false) {
    return this.prisma.menuItem.findMany({
      where: availableOnly ? { isAvailable: true } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findBySlug(slug: string) {
    const item = await this.prisma.menuItem.findUnique({ where: { slug } });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async create(dto: CreateMenuItemDto) {
    const slug = generateSlug(getNameForSlug(dto.name));
    return this.prisma.menuItem.create({
      data: {
        slug,
        category: dto.category,
        name: toJson(dto.name)!,
        description: toJson(dto.description)!,
        details: toJson(dto.details),
        price: dto.price,
        oldPrice: dto.oldPrice,
        image: dto.image,
        images: dto.images || [],
        tags: dto.tags || [],
        allergens: dto.allergens || [],
        isFeatured: dto.isFeatured ?? false,
        isAvailable: dto.isAvailable ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(slug: string, dto: Partial<CreateMenuItemDto>) {
    const existing = await this.findBySlug(slug);
    const data: Record<string, unknown> = { ...dto };
    if (dto.name) {
      data.slug = generateSlug(getNameForSlug(dto.name));
    }
    return this.prisma.menuItem.update({
      where: { id: existing.id },
      data,
    });
  }

  async remove(slug: string) {
    await this.findBySlug(slug);
    await this.prisma.menuItem.delete({ where: { slug } });
    return { message: 'Menu item deleted' };
  }
}
