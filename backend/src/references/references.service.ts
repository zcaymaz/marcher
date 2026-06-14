import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReferenceDto } from '../common/dto';
import { generateSlug, getNameForSlug } from '../common/utils/slug.util';
import { toJson } from '../common/utils/json.util';

@Injectable()
export class ReferencesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.reference.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findBySlug(slug: string) {
    const ref = await this.prisma.reference.findUnique({ where: { slug } });
    if (!ref) throw new NotFoundException('Reference not found');
    return ref;
  }

  async create(dto: CreateReferenceDto) {
    const slug = generateSlug(getNameForSlug(dto.name));
    return this.prisma.reference.create({
      data: {
        slug,
        type: dto.type || 'BRAND',
        name: toJson(dto.name)!,
        description: toJson(dto.description),
        image: dto.image,
        logo: dto.logo,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(slug: string, dto: Partial<CreateReferenceDto>) {
    await this.findBySlug(slug);
    const data: Record<string, unknown> = { ...dto };
    if (dto.name) data.slug = generateSlug(getNameForSlug(dto.name));
    return this.prisma.reference.update({ where: { slug }, data });
  }

  async remove(slug: string) {
    await this.findBySlug(slug);
    await this.prisma.reference.delete({ where: { slug } });
    return { message: 'Reference deleted' };
  }
}
